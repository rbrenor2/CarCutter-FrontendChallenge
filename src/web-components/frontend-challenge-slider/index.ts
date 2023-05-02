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

  isFullscreen = false;

  // dragging
  mousedown = false;
  mousemove = false;
  mouseup = false;

  touchstart = false;
  touchend = false;
  touchmove = false;

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
    <div id="container">
    <div id="gallery">
      <img
        id="image"
        alt="X6 M Competition"
        tabindex="0"
        class=""
        src="https://ik.imagekit.io/brenor2/1.png"
      />
    </div>
    <button class="btn" id="fullscreen-button"><i class="fas fa-expand"></i> fullscreen</button>
    <div><input id="slider" type="range" min="1" max="50" /></div>
    </div>
    `;

    // Append HTML content
    const replaceMe = document.createElement("div");
    replaceMe.innerHTML = template;
    replaceMe.classList.add("replace-me");
    this.appendToShadowRoot(replaceMe);

    // adding listeners
    this.setupSliderListener();
    this.setupFullscreenListener();
    this.setupDragListeners();

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

  setupFullscreenListener() {
    const button = this.shadowRoot?.querySelector("#fullscreen-button");
    const container = this.shadowRoot?.querySelector("#container");

    button?.addEventListener("click", (e) => {
      this.toggleFullscreen(container);
    });
  }

  toggleFullscreen(elem: any) {
    if (!this.isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  shouldChangeImage() {
    if ((this.mousedown && this.mousemove) || (this.touchstart && this.touchmove)) {
      return true;
    } else {
      return false;
    }
  }

  // Dragger
  setupDragListeners() {
    const gallery = this.shadowRoot?.querySelector("#gallery");

    gallery?.addEventListener("mousedown", (e) => {
      console.log("mousedown");
      this.mousedown = true;
      // if(this.shouldChangeImage()) {
      //   const url = this.media[value];
      //   this.setImage(url);
      // }
    });
    gallery?.addEventListener("touchstart", (e) => {
      console.log("touchstart");
      this.touchend = false;
      this.touchstart = true;
    });
    gallery?.addEventListener("mousemove", (e) => {
      this.mousemove = true;
      console.log("mousemove");
      console.log(e);
    });
    gallery?.addEventListener("touchmove", (e) => {
      console.log("touchmove");
      this.touchmove = true;
    });
    document.addEventListener("mouseup", (e) => {
      console.log("mouseup");
      this.mouseup = true;
      this.mousedown = false;
    });
    gallery?.addEventListener("touchend", (e) => {
      console.log("touchend");
      this.touchend = true;
      this.touchstart = false;
    });
  }
}

customElements.define(FrontendChallengeSlider.TAG, FrontendChallengeSlider);
