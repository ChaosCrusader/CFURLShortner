const config = {
  no_ref: "on",
  cors: "on",
  unique_link: true,
};

const html404 = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>4̷̡̳̖̆̇͘͟͟͢͝0̷҉̧͇̩̪͙̏ͭͩ̂͘͟͢͜͡͞͝͞4̷̡̳̖̆̇͘͟͟͢͝ ɴᴏᴛ ғᴏᴜɴᴅ</title>
    <link rel="icon" type="image/x-icon" href="https://i.imgur.com/CAxWRSk.png">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #222831; /* Dark grayish-blue background */
            color: #e0e0e0; /* Light gray text */
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            text-align: center;
            background-color: #413F42; /* Dark grayish color */
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(224, 224, 224, 0.1);
        }

        h1 {
            color: #76ABAE; /* Light blue */
            margin-bottom: 10px;
        }

        p {
            margin-bottom: 20px;
        }

        a {
            text-decoration: none;
            color: #76ABAE; /* Light blue link */
            transition: color 0.3s ease;
        }

        a:hover {
            color: #01579b; /* Darker blue on hover */
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>4̷̱ͧͩ̈̀͢͜0̴̫͙͙̪̔̽̔͛͘4̷̱ͧͩ̈̀͢͜ ɴᴏᴛ ғᴏᴜɴᴅ</h1>
        <p>ᴛʜᴇ ʟɪɴᴋ/ᴜʀʟ ʏᴏᴜ ᴠɪsɪᴛᴇᴅ ᴄᴏᴜʟᴅ ɴᴏᴛ ʙᴇ ғᴏᴜɴᴅ.</p>
        <p>ɢᴏ ʙᴀᴄᴋ <a href="/" style="color: #76ABAE;">ʜᴏᴍᴇ</a> ᴏʀ ᴛʀʏ ᴀɴᴏᴛʜᴇʀ ʟɪɴᴋ.</p>
    </div>
</body>

</html>
`;

let response_header = {
  "content-type": "text/html;charset=UTF-8",
};

if (config.cors === "on") {
  response_header = {
    ...response_header,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
  };
}

async function randomString(len) {
  len = len || 6;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = $chars.length;
  let result = '';
  for (let i = 0; i < len; i++) {
    result += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

async function sha512(url) {
  url = new TextEncoder().encode(url);
  const url_digest = await crypto.subtle.digest({ name: "SHA-512" }, url);
  const hashArray = Array.from(new Uint8Array(url_digest));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function checkURL(URL) {
  let Expression = /^http(s)?:\/\//i;
  if (!Expression.test(URL)) {
    URL = "https://" + URL;
  }
  return URL;
}

async function save_url(URL) {
  URL = await checkURL(URL);
  let random_key = await randomString();
  let is_exist = await LINKS.get(random_key);
  if (is_exist == null) {
    await LINKS.put(random_key, URL);
    return random_key;
  } else {
    return save_url(URL);
  }
}

async function is_url_exist(url_sha512) {
  let is_exist = await LINKS.get(url_sha512);
  return is_exist ? is_exist : false;
}

async function handleRequest(request) {
  if (request.method === "POST") {
    let req = await request.json();
    let validatedURL = await checkURL(req.url);
    if (!await checkURL(validatedURL)) {
      return new Response(`{"status":500,"key":": Error: Incorrect URL Format."}`, { headers: response_header });
    }
    let random_key;
    if (config.unique_link) {
      let url_sha512 = await sha512(validatedURL);
      let url_key = await is_url_exist(url_sha512);
      random_key = url_key || await save_url(validatedURL);
    } else {
      random_key = await save_url(validatedURL);
    }
    return new Response(`{"status":200,"key":"/${random_key}"}`, { headers: response_header });
  } else if (request.method === "OPTIONS") {
    return new Response(``, { headers: response_header });
  }

  const requestURL = new URL(request.url);
  const path = requestURL.pathname.split("/")[1];
  const params = requestURL.search;

  if (!path) {
    const html = await fetch("https://raw.githubusercontent.com/ChaosCrusader/CFURLShortner/main/src/home.html");
    return new Response(await html.text(), { headers: { "content-type": "text/html;charset=UTF-8" } });
  }

  const value = await LINKS.get(path);
  let location;

  if (params) {
    location = value + params;
  } else {
    location = value;
  }

  if (location) {
    if (config.no_ref === "on") {
      let no_ref = await fetch("https://raw.githubusercontent.com/ChaosCrusader/CFURLShortner/main/src/forward.html");
      no_ref = await no_ref.text();
      no_ref = no_ref.replace(/{Replace}/gm, location);
      return new Response(no_ref, { headers: { "content-type": "text/html;charset=UTF-8" } });
    } else {
      return Response.redirect(location, 302);
    }
  }

  return new Response(html404, { headers: { "content-type": "text/html;charset=UTF-8" }, status: 404 });
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});