import { useEffect } from "react";
import IMask from "imask";

const toggleTabs = (button) => {
  const tabs = button.closest("[data-js-tabs]");
  const buttons = [...tabs.querySelectorAll("[data-js-tabs-button]")];
  const contents = [...tabs.querySelectorAll("[data-js-tabs-content]")];
  const activeIndex = buttons.indexOf(button);

  buttons.forEach((item, index) => {
    const isActive = index === activeIndex;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });
  contents.forEach((content, index) => {
    const isActive = index === activeIndex;
    content.classList.toggle("is-active", isActive);
    content.hidden = !isActive;
    content.tabIndex = isActive ? 0 : -1;
  });
};

export default function usePageInteractions() {
  useEffect(() => {
    document.querySelectorAll("[data-js-tabs]").forEach((tabs) => {
      const activeButton = tabs.querySelector(
        "[data-js-tabs-button].is-active",
      );
      if (activeButton) toggleTabs(activeButton);
    });

    const masks = [...document.querySelectorAll("[data-js-input-mask]")].map(
      (input) => IMask(input, { mask: input.dataset.jsInputMask }),
    );

    const onClick = (event) => {
      const burger = event.target.closest("[data-js-header-burger-button]");
      if (burger) {
        const overlay = document.querySelector("[data-js-header-overlay]");
        const isActive = overlay.classList.toggle("is-active");
        burger.classList.toggle("is-active", isActive);
        burger.setAttribute("aria-expanded", String(isActive));
      }

      const tabButton = event.target.closest("[data-js-tabs-button]");
      if (tabButton) toggleTabs(tabButton);

      const playButton = event.target.closest(
        "[data-js-video-player-play-button]",
      );
      if (playButton) {
        const player = playButton.closest("[data-js-video-player]");
        const video = player.querySelector("[data-js-video-player-video]");
        const elements = player.querySelector("[data-js-video-player-element]");
        if (video.paused) {
          void video.play();
          elements.classList.remove("is-active");
        } else {
          video.pause();
          elements.classList.add("is-active");
        }
      }

      const expandButton = event.target.closest(
        "[data-js-expandable-content-button]",
      );
      if (expandButton) {
        expandButton
          .closest("[data-js-expandable-content]")
          .classList.add("is-expanded");
        expandButton.remove();
      }

      const selectButton = event.target.closest("[data-js-select-button]");
      if (selectButton) {
        const select = selectButton.closest("[data-js-select]");
        const dropdown = select.querySelector("[data-js-select-dropdown]");
        const expanded = selectButton.classList.toggle("is-expanded");
        dropdown.classList.toggle("is-expanded", expanded);
        selectButton.setAttribute("aria-expanded", String(expanded));
      }

      const option = event.target.closest("[data-js-select-option]");
      if (option) {
        const select = option.closest("[data-js-select]");
        const control = select.querySelector(
          "[data-js-select-original-control]",
        );
        const button = select.querySelector("[data-js-select-button]");
        const dropdown = select.querySelector("[data-js-select-dropdown]");
        control.value = option.dataset.value ?? option.textContent.trim();
        button.firstElementChild.textContent = option.textContent.trim();
        select.querySelectorAll("[data-js-select-option]").forEach((item) => {
          const isSelected = item === option;
          item.classList.toggle("is-selected", isSelected);
          item.setAttribute("aria-selected", String(isSelected));
        });
        button.classList.remove("is-expanded");
        button.setAttribute("aria-expanded", "false");
        dropdown.classList.remove("is-expanded");
      }
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      masks.forEach((mask) => mask.destroy());
    };
  }, []);
}
