const createScript = (src: string) => `<script type="module" src="${src}"></script>`;
const createLink = (src: string) => `<link rel="stylesheet" href="${src}"></link>`;
const generateHTML = (scripts: Array<string>, links: Array<string>) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Esbuild App</title>
  ${links.join("\n")}
</head>

<body>
  <div id="root"></div>
  ${scripts.join("\n")}
</body>

</html>
`;

export { createLink, createScript, generateHTML };