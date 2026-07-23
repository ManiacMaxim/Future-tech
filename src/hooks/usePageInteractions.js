import { startTransition, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resolveInternalRoute } from "../routing";

const prefetchedRoutes = new Set();

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

const getSelectParts = (select) => ({
  button: select.querySelector("[data-js-select-button]"),
  control: select.querySelector("[data-js-select-original-control]"),
  dropdown: select.querySelector("[data-js-select-dropdown]"),
  options: [...select.querySelectorAll("[data-js-select-option]")],
  value: select.querySelector("[data-js-select-value]"),
});

const setSelectExpanded = (select, expanded) => {
  const { button, dropdown } = getSelectParts(select);
  button.setAttribute("aria-expanded", String(expanded));
  button.classList.toggle("is-expanded", expanded);
  dropdown.hidden = !expanded;
  select.classList.toggle("is-expanded", expanded);
};

const setActiveSelectOption = (select, index) => {
  const { button, options } = getSelectParts(select);
  const normalizedIndex = (index + options.length) % options.length;

  options.forEach((option, optionIndex) => {
    option.classList.toggle("is-active", optionIndex === normalizedIndex);
  });
  button.setAttribute("aria-activedescendant", options[normalizedIndex].id);
  options[normalizedIndex].scrollIntoView?.({ block: "nearest" });
  return normalizedIndex;
};

const selectOption = (select, option) => {
  const { button, control, options, value } = getSelectParts(select);
  const selectedValue = option.dataset.value ?? option.textContent.trim();

  control.value = selectedValue;
  value.textContent = option.textContent.trim();
  options.forEach((item) => {
    const isSelected = item === option;
    item.classList.toggle("is-selected", isSelected);
    item.setAttribute("aria-selected", String(isSelected));
  });
  button.setAttribute("aria-activedescendant", option.id);
  setSelectExpanded(select, false);
  control.dispatchEvent(new Event("change", { bubbles: true }));
};

export default function usePageInteractions() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let masks = [];
    let isDisposed = false;

    document.querySelectorAll("[data-js-tabs]").forEach((tabs) => {
      const activeButton = tabs.querySelector(
        "[data-js-tabs-button].is-active",
      );
      if (activeButton) toggleTabs(activeButton);
    });

    const maskInputs = [...document.querySelectorAll("[data-js-input-mask]")];
    if (maskInputs.length > 0) {
      void import("imask").then(({ default: IMask }) => {
        if (isDisposed) return;
        masks = maskInputs.map((input) =>
          IMask(input, { mask: input.dataset.jsInputMask }),
        );
      });
    }

    const onClick = (event) => {
      const option = event.target.closest("[data-js-select-option]");
      if (option) {
        const select = option.closest("[data-js-select]");
        selectOption(select, option);
        select.querySelector("[data-js-select-button]").focus();
        return;
      }

      const selectButton = event.target.closest("[data-js-select-button]");
      if (selectButton) {
        const select = selectButton.closest("[data-js-select]");
        const isExpanded =
          selectButton.getAttribute("aria-expanded") === "true";
        setSelectExpanded(select, !isExpanded);
        return;
      }

      document
        .querySelectorAll("[data-js-select].is-expanded")
        .forEach((select) => setSelectExpanded(select, false));

      const link = event.target.closest("a[href]");
      const route = link
        ? resolveInternalRoute(link.getAttribute("href"))
        : null;
      const isPlainLeftClick =
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey;

      if (
        route &&
        isPlainLeftClick &&
        !link.hasAttribute("download") &&
        (!link.target || link.target === "_self")
      ) {
        event.preventDefault();
        startTransition(() => navigate(route.path));
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }

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
    };

    const onKeyDown = (event) => {
      const tabButton = event.target.closest("[data-js-tabs-button]");
      if (tabButton) {
        const tabs = tabButton.closest("[data-js-tabs]");
        const buttons = [...tabs.querySelectorAll("[data-js-tabs-button]")];
        const currentIndex = buttons.indexOf(tabButton);
        const nextIndexByKey = {
          ArrowRight: (currentIndex + 1) % buttons.length,
          ArrowDown: (currentIndex + 1) % buttons.length,
          ArrowLeft: (currentIndex - 1 + buttons.length) % buttons.length,
          ArrowUp: (currentIndex - 1 + buttons.length) % buttons.length,
          Home: 0,
          End: buttons.length - 1,
        };
        const nextIndex = nextIndexByKey[event.key];

        if (nextIndex !== undefined) {
          event.preventDefault();
          toggleTabs(buttons[nextIndex]);
          buttons[nextIndex].focus();
        }
        return;
      }

      const button = event.target.closest("[data-js-select-button]");
      if (!button) return;

      const select = button.closest("[data-js-select]");
      const { options } = getSelectParts(select);
      const currentIndex = Math.max(
        0,
        options.findIndex(
          (option) =>
            option.id === button.getAttribute("aria-activedescendant"),
        ),
      );

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setSelectExpanded(select, true);
        setActiveSelectOption(
          select,
          currentIndex + (event.key === "ArrowDown" ? 1 : -1),
        );
        return;
      }

      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        setSelectExpanded(select, true);
        setActiveSelectOption(
          select,
          event.key === "Home" ? 0 : options.length - 1,
        );
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (button.getAttribute("aria-expanded") === "true") {
          selectOption(select, options[currentIndex]);
        } else {
          setSelectExpanded(select, true);
        }
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setSelectExpanded(select, false);
      }
    };

    const preloadLinkedRoute = (event) => {
      const link = event.target.closest("a[href]");
      const route = link
        ? resolveInternalRoute(link.getAttribute("href"))
        : null;
      const currentRoute = resolveInternalRoute(location.pathname);
      const isEligible =
        route &&
        route.path !== currentRoute?.path &&
        !link.hasAttribute("download") &&
        (!link.target || link.target === "_self") &&
        !prefetchedRoutes.has(route.path);

      if (isEligible) {
        prefetchedRoutes.add(route.path);
        void route.preload().catch(() => prefetchedRoutes.delete(route.path));
      }
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerover", preloadLinkedRoute, {
      passive: true,
    });
    document.addEventListener("focusin", preloadLinkedRoute);
    return () => {
      isDisposed = true;
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerover", preloadLinkedRoute);
      document.removeEventListener("focusin", preloadLinkedRoute);
      masks.forEach((mask) => mask.destroy());
    };
  }, [location.pathname, navigate]);
}
