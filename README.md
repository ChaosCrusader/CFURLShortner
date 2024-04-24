# Cloudflare URL Shortener
A minimilistic URL shortener created using Cloudflare Workers and KV.

## Preview
<details>
  <summary>Click Me</summary>

- **Home Page**
![Home Page](https://github.com/ChaosCrusader/CFURLShortner/assets/105801260/9ab40f07-511e-4821-9da2-95f08d8e9248)

- **Forward Page**
![Forward Page](https://github.com/ChaosCrusader/CFURLShortner/assets/105801260/41869621-c0f5-4882-ad93-c3b575ffac32)
</details>

## Cloudflare Setup
<details>
  <summary>Click Me</summary>

   ### Creating a Namespace in Cloudflare Workers KV

1. Go to Cloudflare Workers KV and create a namespace.
   
   ![Create a Namespace](https://github.com/ChaosCrusader/URLShortner/assets/105801260/e758b1fa-6017-428b-9e64-250369642950)

### Creating a Worker

2. Create a Worker and paste the content of [workers.js](https://github.com/ChaosCrusader/CFURLShortner/blob/main/workers.js).
   
   ![Create a Worker](https://github.com/ChaosCrusader/URLShortner/assets/105801260/886b450b-b735-41d7-bc16-59f647003670)

### KV Namespace Bindings

3. Go to Workers Settings.
   
   ![Workers Settings](https://github.com/ChaosCrusader/URLShortner/assets/105801260/db773367-c2ff-4248-8b14-e9f74fe371c6)

4. Set the Variable name as **LINKS** and the KV Namespace to the namespace you created in the first step.
   
   ![Set KV Namespace](https://github.com/ChaosCrusader/URLShortner/assets/105801260/372cbdf4-b82d-4461-ad34-81f9fecae692)

5. Save and Deploy your changes.
</details>

## Credits
- This project is a lightweight code adaptation from [xyTom/Url-Shorten-Worker](https://github.com/xyTom/Url-Shorten-Worker).

## License
- This project is licensed under [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/ChaosCrusader/CFURLShortner/blob/main/LICENSE)

