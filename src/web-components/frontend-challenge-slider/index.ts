import Style from "./style";
import BrowserHelper from "../../helpers/browser-helper";
import CustomElement from "../../core/custom-element";

const baseCdnUrl = "https://ik.imagekit.io/brenor2/";
export default class FrontendChallengeSlider extends CustomElement {
  //- TAG --------------------------------------------------------------------------------------------------------------
  public static readonly TAG: string = "frontend-challenge-slider";
  public static create(): FrontendChallengeSlider {
    return document.createElement(FrontendChallengeSlider.TAG) as FrontendChallengeSlider;
  }

  //- Members ----------------------------------------------------------------------------------------------------------
  public isMobile = BrowserHelper.isBrowserMobile();

  //- Attributes -------------------------------------------------------------------------------------------------------
  get cacheSize(): number | undefined {
    const cacheSize = Number(this.getAttribute("cache-size"));
    return cacheSize ?? undefined;
  }

  get showTumbnails(): boolean {
    return !!this.getAttribute("showTumbnails");
  }

  get autoplay(): boolean {
    return !!this.getAttribute("autoplay");
  }

  get carousel(): boolean {
    return !!this.getAttribute("carousel");
  }

  get media() {
    // TODO get array with links from attr
    const quantity = 35;
    const links = [];

    for (let index = 1; index <= quantity; index++) {
      links.push(`${baseCdnUrl}${index}.png`);
    }

    return links;
  }

  //- Constructor ------------------------------------------------------------------------------------------------------
  constructor() {
    super();
  }

  //- HTMLElemet interface implementation ------------------------------------------------------------------------------
  connectedCallback() {
    // Apply adopted style sheets found in 'style.module.css'
    this.applyAdoptedStyleSheets(Style);

    document.onreadystatechange = () => {
      this.readyStateListener();
    };

    // TODO Add your implementation here
    const template = `
    <div class="container">
    <div class="gallery">
      <img
        id="image"
        alt="X6 M Competition"
        tabindex="0"
        class=""
        src="https://ik.imagekit.io/brenor2/1.png"
      />
    </div>
    <div><input id="slider" type="range" min="1" max="50" /></div>
    </div>
    `;

    // Append HTML content
    const replaceMe = document.createElement("div");
    replaceMe.innerHTML = template;
    replaceMe.classList.add("replace-me");
    this.appendToShadowRoot(replaceMe);

    //
    // add oninput event listener
    this.setupSliderListener();

    // setup first image
    const imgGallery = this.shadowRoot?.querySelector("#image") as HTMLElement;
    imgGallery.setAttribute("src", this.media[0]);
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(name: string, prev: string, value: string) {}

  static get observedAttributes() {
    return ["cache-size", "show-thumbnails", "autoplay", "carousel", "media"];
  }

  //- Listeners
  setupSliderListener() {
    const slider = this.shadowRoot?.querySelector("#slider");

    slider?.addEventListener("input", (e) => {
      const value = Number((e.target as HTMLInputElement).value);
      const url = this.media[value];
      this.setImage(url);
    });
  }

  setImage(url: string) {
    const image = this.shadowRoot?.querySelector("#image") as HTMLInputElement;
    image.setAttribute("src", url);
  }

  //- Preload media
  preloadMedia(size?: number) {
    for (let index = 0; index < (size ?? this.media.length); index++) {
      const cachedImage = new Image();
      cachedImage.addEventListener("load", () => {
        console.log(`Cached image ${index}: ${this.media[index]}`);
      });
      cachedImage.src = this.media[index];
    }
  }

  readyStateListener() {
    switch (document.readyState) {
      case "complete":
        this.preloadMedia(this.cacheSize);
        break;

      default:
        break;
    }
  }
}

customElements.define(FrontendChallengeSlider.TAG, FrontendChallengeSlider);
