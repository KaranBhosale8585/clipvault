import sys
import json
import os
import yt_dlp
import traceback

def extract_metadata(url):
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'format': 'best',
        'skip_download': True,
    }

    # Add proxy support
    proxy_env = os.environ.get("INSTAGRAM_PROXY") or os.environ.get("PROXY_URL")
    if proxy_env:
        ydl_opts['proxy'] = proxy_env

    try:
        try:
            import yt_dlp.version
            yt_dlp_version = yt_dlp.version.__version__
        except Exception:
            yt_dlp_version = "unknown"

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            metadata = {
                "success": True,
                "yt_dlp_version": yt_dlp_version,
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
                "debug": info
            }
            return metadata
            
    except Exception as e:
        try:
            import yt_dlp.version
            yt_dlp_version = yt_dlp.version.__version__
        except Exception:
            yt_dlp_version = "unknown"
            
        error_msg = str(e)
        if any(keyword in error_msg.lower() for keyword in ["empty media response", "login required", "403", "sign in"]):
            error_msg += " (Tip: Public content access failed. Hosted server environments often need a proxy. Please configure INSTAGRAM_PROXY. User accounts/cookies are not accepted.)"

        return {
            "success": False,
            "yt_dlp_version": yt_dlp_version,
            "error": error_msg,
            "traceback": traceback.format_exc()
        }
    finally:
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

    # Handle --version or -v
    if url == "--version" or url == "-v":
        try:
            import yt_dlp.version
            ver = yt_dlp.version.__version__
        except Exception:
            ver = "unknown"
        print(json.dumps({"success": True, "data": {"version": ver}}))
        sys.exit(0)

    # Handle --update
    if url == "--update":
        try:
            import subprocess
            # Run: pip install --upgrade yt-dlp
            res = subprocess.run(
                [sys.executable, "-m", "pip", "install", "--upgrade", "yt-dlp"],
                capture_output=True,
                text=True
            )
            if res.returncode == 0:
                import importlib
                import yt_dlp.version
                try:
                    importlib.reload(yt_dlp.version)
                except Exception:
                    pass
                new_ver = yt_dlp.version.__version__
                print(json.dumps({
                    "success": True,
                    "data": {
                        "message": f"yt-dlp updated successfully to version {new_ver}.",
                        "version": new_ver
                    }
                }))
                sys.exit(0)
            else:
                print(json.dumps({
                    "success": False,
                    "error": f"pip upgrade failed (code {res.returncode}): {res.stderr or res.stdout}"
                }))
                sys.exit(0)
        except Exception as e:
            print(json.dumps({
                "success": False,
                "error": f"Exception during upgrade: {str(e)}",
                "traceback": traceback.format_exc()
            }))
            sys.exit(0)

    result = extract_metadata(url)
    print(json.dumps(result))


