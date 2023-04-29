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

  //- Constructor ------------------------------------------------------------------------------------------------------
  constructor() {
    super();
  }

  //- HTMLElemet interface implementation ------------------------------------------------------------------------------
  connectedCallback() {
    // Apply adopted style sheets found in 'style.module.css'
    this.applyAdoptedStyleSheets(Style);

    // TODO Add your implementation here
    const template = `
    <div class="container">
    <div class="gallery">
      <img
        id="image"
        alt="X6 M Competition"
        tabindex="0"
        class=""
        src="https://ik.imagekit.io/brenor2/11.png"
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

    // add oninput event listener
    const slider = this.shadowRoot?.querySelector("#slider");

    slider?.addEventListener("input", (e) => {
      const value = (e.target as HTMLInputElement).value;
      // change image
      const image = this.shadowRoot?.querySelector("#image") as HTMLInputElement;
      image.src = `${baseCdnUrl}${value}.png`;
    });
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(name: string, prev: string, value: string) {}

  static get observedAttributes() {
    return ["cache-size", "show-thumbnails", "autoplay", "carousel"];
  }
}

customElements.define(FrontendChallengeSlider.TAG, FrontendChallengeSlider);
