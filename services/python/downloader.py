import sys
import json
import os
import tempfile
import yt_dlp
import traceback

def extract_metadata(url):
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'format': 'best',
        'skip_download': True,
    }

    temp_cookie_file = None
    try:
        # 1. Check for cookie file configured via env variable (highest priority)
        cookies_env = os.environ.get("INSTAGRAM_COOKIES")
        if cookies_env:
            # Check if it's a file path
            if os.path.exists(cookies_env):
                ydl_opts['cookiefile'] = cookies_env
            else:
                # Assume it's the raw cookies string (Netscape format)
                # Write to a temporary file
                fd, temp_cookie_file = tempfile.mkstemp(suffix=".txt", prefix="cookies_")
                with os.fdopen(fd, 'w') as f:
                    f.write(cookies_env)
                ydl_opts['cookiefile'] = temp_cookie_file

        # 2. Otherwise check for local cookies.txt files in common locations
        else:
            possible_cookies = [
                'cookies.txt',
                'instagram-cookies.txt',
                os.path.join(os.path.dirname(__file__), 'cookies.txt'),
                os.path.join(os.path.dirname(__file__), 'instagram-cookies.txt'),
                os.path.join(os.getcwd(), 'cookies.txt'),
                os.path.join(os.getcwd(), 'instagram-cookies.txt'),
            ]
            for cp in possible_cookies:
                if os.path.exists(cp):
                    ydl_opts['cookiefile'] = cp
                    break

        # 3. Fallback: try to extract cookies from local browsers if running in development mode
        # and no cookiefile has been configured yet.
        if 'cookiefile' not in ydl_opts and os.environ.get("NODE_ENV") != "production":
            # We try the most popular browsers in local environment
            browsers = ['chrome', 'firefox', 'edge', 'brave', 'opera']
            for browser in browsers:
                try:
                    # Test if we can read cookies from the browser
                    # yt-dlp might warn or raise, but we only want to set it if it actually doesn't crash on init
                    test_opts = dict(ydl_opts)
                    test_opts['cookiesfrombrowser'] = (browser,)
                    with yt_dlp.YoutubeDL(test_opts) as ydl:
                        pass
                    ydl_opts['cookiesfrombrowser'] = (browser,)
                    break # Stop at first browser that we can access
                except Exception:
                    pass

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Extract relevant fields
            metadata = {
                "success": True,
                "data": {
                    "id": info.get("id"),
                    "title": info.get("title") or info.get("description", "")[:100],
                    "uploader": info.get("uploader"),
                    "thumbnail": info.get("thumbnail"),
                    "thumbnails": info.get("thumbnails"),
                    "duration": info.get("duration"),
                    "videoUrl": info.get("url"),
                    "formats": [{ "url": f.get("url"), "ext": f.get("ext"), "vcodec": f.get("vcodec") } for f in info.get("formats", [])]
                },
                "debug": info # Include full info for debugging
            }
            return metadata
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }
    finally:
        # Cleanup temporary cookie file if created
        if temp_cookie_file and os.path.exists(temp_cookie_file):
            try:
                os.remove(temp_cookie_file)
            except Exception:
                pass

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No URL provided"}))
        sys.exit(1)

    url = sys.argv[1]
    result = extract_metadata(url)
    print(json.dumps(result))

