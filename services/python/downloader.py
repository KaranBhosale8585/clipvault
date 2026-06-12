import sys
import json
import yt_dlp
import traceback

def extract_metadata(url):
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'format': 'best',
        'skip_download': True,
    }

    try:
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

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No URL provided"}))
        sys.exit(1)

    url = sys.argv[1]
    result = extract_metadata(url)
    print(json.dumps(result))
