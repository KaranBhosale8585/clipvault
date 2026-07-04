import sys
import json
import os
import yt_dlp
import traceback
import urllib.request
import urllib.parse
import time

def preflight_check(url, proxy=None):
    """
    Performs a preflight HTTP request to validate URL reachability,
    detect deleted/unavailable posts, and detect redirects to login pages.
    Returns: (is_reachable, error_message, final_url)
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.instagram.com/'
    }
    
    # Configure proxy if provided
    handlers = []
    if proxy:
        handlers.append(urllib.request.ProxyHandler({'http': proxy, 'https': proxy}))
    
    # Custom redirect detector to inspect redirects
    class RedirectDetector(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, hdrs, newurl):
            req.redirected_url = newurl
            return super().redirect_request(req, fp, code, msg, hdrs, newurl)

    detector = RedirectDetector()
    handlers.append(detector)
    
    opener = urllib.request.build_opener(*handlers)
    req = urllib.request.Request(url, headers=headers)
    
    try:
        # 10 second timeout for reachability check
        with opener.open(req, timeout=10) as response:
            final_url = response.geturl()
            parsed_final = urllib.parse.urlparse(final_url)
            
            # Detect redirect to account login page
            if 'accounts/login' in parsed_final.path or 'login' in parsed_final.path:
                return False, "This Instagram Reel is private or requires login. Only public content is supported.", final_url
                
            # Read a tiny chunk to ensure connection is live
            _ = response.read(128)
            return True, None, final_url
            
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return False, "The requested Instagram Reel could not be found. It may have been deleted, or the account is private/deactivated.", None
        elif e.code == 403:
            return False, "Access forbidden (403). Instagram is blocking anonymous extraction requests from this IP.", None
        elif e.code == 429:
            return False, "Too many requests. Instagram has temporarily rate-limited requests from this IP.", None
        else:
            return False, f"Instagram returned HTTP error {e.code} during reachability validation.", None
    except urllib.error.URLError as e:
        return False, f"Network validation failed: {str(e.reason)}. Please check the proxy settings.", None
    except Exception as e:
        return False, f"Preflight validation check failed: {str(e)}", None

def extract_metadata(url):
    proxy_env = os.environ.get("INSTAGRAM_PROXY") or os.environ.get("PROXY_URL")
    
    # 1. Run Preflight Reachability Check
    is_reachable, preflight_error, _ = preflight_check(url, proxy_env)
    if not is_reachable:
        return {
            "success": False,
            "error": preflight_error,
            "error_type": "preflight"
        }

    # 2. Configure yt-dlp options
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'format': 'best',
        'skip_download': True,
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.instagram.com/'
        }
    }
    
    if proxy_env:
        ydl_opts['proxy'] = proxy_env

    # 3. Retry loop with exponential backoff (3 attempts)
    max_attempts = 3
    base_delay = 1.0 # 1s, 2s, 4s
    last_error = None
    
    for attempt in range(1, max_attempts + 1):
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                try:
                    import yt_dlp.version
                    yt_dlp_version = yt_dlp.version.__version__
                except Exception:
                    yt_dlp_version = "unknown"
                    
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
            last_error = e
            if attempt < max_attempts:
                sleep_time = base_delay * (2 ** (attempt - 1))
                time.sleep(sleep_time)

    # 4. Graceful Error Handling & User-friendly Mapping
    try:
        import yt_dlp.version
        yt_dlp_version = yt_dlp.version.__version__
    except Exception:
        yt_dlp_version = "unknown"
        
    error_msg = str(last_error)
    friendly_msg = "An error occurred while communicating with Instagram."
    
    if any(k in error_msg.lower() for k in ["private", "login", "credentials"]):
        friendly_msg = "This Instagram Reel is private. ClipVault does not require or accept user credentials, and only processes publicly accessible Reels."
    elif any(k in error_msg.lower() for k in ["404", "not found", "does not exist"]):
        friendly_msg = "The requested Reel could not be found. It may have been deleted, or the account is private/deactivated."
    elif any(k in error_msg.lower() for k in ["403", "forbidden", "blocked", "empty media response"]):
        friendly_msg = "Access is restricted. Instagram's servers are temporarily blocking anonymous requests from this IP. Please try again later or configure a proxy."
    elif any(k in error_msg.lower() for k in ["timeout", "connection timed out", "network"]):
        friendly_msg = "Connection timed out. There was a temporary network issue communicating with Instagram's servers."
    elif "429" in error_msg.lower():
        friendly_msg = "Too many requests. Instagram has temporarily rate-limited requests from this IP. Please try again later."
        
    return {
        "success": False,
        "yt_dlp_version": yt_dlp_version,
        "error": friendly_msg,
        "raw_error": error_msg,
        "traceback": traceback.format_exc()
    }

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
