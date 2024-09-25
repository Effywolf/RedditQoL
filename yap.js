const getLastItem = (thePath) => {
  if (thePath.endsWith("/")) {
    thePath = thePath.slice(0, -1);
  }
  return thePath.substring(thePath.lastIndexOf("/") + 1);
};

const getCurrentUrl = () => window.location.href;

const getVideoName = () => getLastItem(getCurrentUrl()).replaceAll("/", "");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function UntilExists(callback) {
  let result = await callback();
  while (!result) {
    await sleep(1000);
    result = await callback();
  }
  return result;
}

async function getShareButton() {
  const post = document.getElementsByTagName("shreddit-post");
  const postElement = Array.from(post)[0];

  const shadowRoot = await UntilExists(() => postElement.shadowRoot);
  const shareButton = await UntilExists(() =>
    shadowRoot.querySelector("slot[name='share-button']")
  );

  return shareButton;
}

async function addDownloadButton(link, filename) {
  const shareButton = await getShareButton();

  const newDiv = document.createElement("div");
  newDiv.innerHTML = `<faceplate-dropdown-menu position="bottom-start" class="share-dropdown-menu relative connected">
 <button rpl="" class="button border-md flex flex-row justify-center items-center h-xl font-semibold relative text-12 button-secondary inline-flex items-center 
       px-sm
       hover:text-secondary hover:bg-secondary-background-hover hover:border-secondary-background-hover
      " style="height: var(--size-button-sm-h); font: var(--font-button-sm)" type="button" aria-haspopup="true" aria-expanded="false">
<span id="teehee-link-thingy">  </span>
 <a href="data:video/mp4,${link}" download="${filename}.mp4">
                                <center>
                                    ✨ Download ✨
                                </center>
                            </a>
 </button>
 </faceplate-dropdown-menu>
`;

  shareButton.insertAdjacentElement("afterend", newDiv);
}

async function addSourceLinkButton(link) {
  const shareButton = await getShareButton();

  const newDiv = document.createElement("div");
  newDiv.innerHTML = `<faceplate-dropdown-menu position="bottom-start" class="share-dropdown-menu relative connected">
 <button rpl="" class="button border-md flex flex-row justify-center items-center h-xl font-semibold relative text-12 button-secondary inline-flex items-center 
       px-sm
       hover:text-secondary hover:bg-secondary-background-hover hover:border-secondary-background-hover
      " style="height: var(--size-button-sm-h); font: var(--font-button-sm)" type="button" aria-haspopup="true" aria-expanded="false">
<span id="teehee-link-thingy"> ✨ Source Link ✨ </span>
 </button>
 </faceplate-dropdown-menu>
`;

  const span = newDiv.querySelector("span[id='teehee-link-thingy']");
  shareButton.insertAdjacentElement("afterend", newDiv);

  newDiv.addEventListener("click", async () => {
    await navigator.clipboard.writeText(link);
    span.innerText = "✨ Copied! ✨";
    await sleep(2000);
    span.innerText = "✨ Source Link ✨";
  });
}

async function main() {
  const queryResult = document.getElementsByTagName("shreddit-player-2");

  const parent = Array.from(queryResult)[0];

  const shadowRoot = await UntilExists(() => parent.shadowRoot);
  const video = await UntilExists(() => shadowRoot.querySelector("video"));

  const videoSrc = video.src;

  await addDownloadButton(videoSrc, getVideoName());
  await addSourceLinkButton(videoSrc);
}

main();
