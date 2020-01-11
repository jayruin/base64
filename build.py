import base64
import re

def get_mimetype(file):
    if ".css" in file:
        return "text/css"
    if ".html" in file:
        return "text/html"
    if ".js" in file:
        return "application/javascript"
    return ""

def file64(link):
    with open(link, "rb") as input_file:
        return base64.b64encode(input_file.read()).decode("ascii")

def media(html_content):
    html_media = html_content
    prog = re.compile(r"(?:src|href)=\".*?\"")
    for line in prog.findall(html_media):
        media_file = line.strip().replace("\"", "").replace("src=", "").replace("href=", "")
        mimetype = get_mimetype(media_file)
        html_media = html_media.replace(media_file, "data:" + mimetype + ";base64," + file64(media_file.lstrip(".").lstrip("/")), 1)
    return html_media

def main():
    s = ""
    with open("base64.html", "r") as f:
        s += "<!DOCTYPE html>\n"
        s += "<html>\n"
        s += "<head>\n"
        s += "\t<meta charset=\"utf-8\">\n"
        s += "\t<title>Base64 File Encoder And Decoder</title>\n"
        s += "</head>\n"
        s += "<body style=\"margin: 0;\">\n"
        s += "\t<iframe src=\"data:text/html;base64,"
        s += base64.b64encode(media(f.read()).encode()).decode("ascii")
        s += "\" style=\"display: block; border: none; height: 100vh; width: 100vw;\"></iframe>\n"
        s += "</body>\n"
        s += "</html>\n"
    with open("index.html", "w") as f:
        f.write(s)

if __name__ == "__main__":
    main()
