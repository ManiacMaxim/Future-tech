import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("FutureTech application shell", () => {
  it("renders the preserved home page through the React router", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Explore the Frontiers of Artificial Intelligence",
      }),
    ).toBeInTheDocument();
    expect(document.querySelector("body > div .header")).toBeInTheDocument();
    expect(document.querySelector("body > div .footer")).toBeInTheDocument();
  });

  it("renders a direct portfolio route without a server round trip", async () => {
    render(
      <MemoryRouter initialEntries={["/podcasts"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "AI Revolution" }),
    ).toBeInTheDocument();
  });

  it("navigates between pages through React Router without reloading the document", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByRole("heading", {
      level: 1,
      name: "Explore the Frontiers of Artificial Intelligence",
    });

    const newsLink = document.querySelector(
      '.header__menu-link[href="./news.html"]',
    );
    fireEvent.click(newsLink);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Today's Headlines: Stay Informed",
      }),
    ).toBeInTheDocument();
    expect(
      document.querySelector('img[src="/images/news/Image2.webp"]'),
    ).toHaveAttribute("loading", "lazy");
  });

  it("gives the logo link an accessible name and secures new-tab links", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    const logo = await screen.findByRole("link", { name: "FutureTech home" });
    const newTabLink = document.querySelector('a[target="_blank"]');

    expect(logo).toHaveClass("header__logo");
    expect(newTabLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("supports arrow-key navigation between tabs", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    const activeTab = await screen.findByRole("tab", { name: "All" });
    activeTab.focus();
    fireEvent.keyDown(activeTab, { key: "ArrowRight" });

    const nextTab = screen.getByRole("tab", { name: "Quantum Computing" });
    expect(nextTab).toHaveAttribute("aria-selected", "true");
    expect(nextTab).toHaveFocus();
  });

  it("defers below-the-fold images and video data", async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByRole("heading", {
      level: 1,
      name: "Explore the Frontiers of Artificial Intelligence",
    });
    expect(
      document.querySelector('img[src="/images/reviews/Profile1.png"]'),
    ).toHaveAttribute("loading", "lazy");

    unmount();
    render(
      <MemoryRouter initialEntries={["/podcasts"]}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByRole("heading", { name: "AI Revolution" });
    expect(document.querySelector("video")).toHaveAttribute("preload", "none");
  });

  it("marks podcast metric tiles for aligned values", async () => {
    render(
      <MemoryRouter initialEntries={["/podcasts"]}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByRole("heading", { name: "AI Revolution" });
    const metrics = document.querySelector(
      ".card__grid--3-cols.card__grid--metrics",
    );

    expect(metrics).toBeInTheDocument();
    expect(metrics.querySelectorAll(":scope > .tile")).toHaveLength(3);
  });

  it("renders the contact message field at the full two-column width", async () => {
    render(
      <MemoryRouter initialEntries={["/contacts"]}>
        <App />
      </MemoryRouter>,
    );

    const message = await screen.findByRole("textbox", { name: /message/i });

    expect(message.parentElement).toHaveClass(
      "feedback-form__cell",
      "feedback-form__cell--wide",
      "field",
    );
  });

  it("toggles the terms checkbox when its label text is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/contacts"]}>
        <App />
      </MemoryRouter>,
    );

    const checkbox = await screen.findByRole("checkbox", {
      name: /I agree with Terms of Use and Privacy Policy/i,
    });
    const label = screen.getByText(
      "I agree with Terms of Use and Privacy Policy",
    );

    expect(checkbox).toHaveAttribute("id", "termsAgreement");
    expect(label.closest("label")).toHaveAttribute("for", "termsAgreement");

    fireEvent.click(label);
    expect(checkbox).toBeChecked();
  });

  it("uses an accessible custom select for the phone prefix", async () => {
    render(
      <MemoryRouter initialEntries={["/contacts"]}>
        <App />
      </MemoryRouter>,
    );

    const prefix = await screen.findByRole("combobox", {
      name: /phone number prefix/i,
    });

    expect(prefix).toHaveTextContent("+7");
    expect(prefix).toHaveAttribute("aria-expanded", "false");
    expect(document.querySelector(".select__body")).toBeInTheDocument();
    expect(document.querySelector('[name="phoneNumberPrefix"]')).toHaveValue(
      "+7",
    );
  });

  it("opens the phone prefix list and syncs the selected value", async () => {
    render(
      <MemoryRouter initialEntries={["/contacts"]}>
        <App />
      </MemoryRouter>,
    );

    const prefix = await screen.findByRole("combobox", {
      name: /phone number prefix/i,
    });
    fireEvent.click(prefix);

    expect(prefix).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("option", { name: "+1" }));

    expect(prefix).toHaveTextContent("+1");
    expect(prefix).toHaveAttribute("aria-expanded", "false");
    expect(document.querySelector('[name="phoneNumberPrefix"]')).toHaveValue(
      "+1",
    );
  });

  it("supports keyboard navigation in the custom phone prefix select", async () => {
    render(
      <MemoryRouter initialEntries={["/contacts"]}>
        <App />
      </MemoryRouter>,
    );

    const prefix = await screen.findByRole("combobox", {
      name: /phone number prefix/i,
    });
    fireEvent.keyDown(prefix, { key: "ArrowDown" });

    expect(prefix).toHaveAttribute("aria-expanded", "true");
    expect(prefix).toHaveAttribute(
      "aria-activedescendant",
      "phone-number-prefix-option-2",
    );

    fireEvent.keyDown(prefix, { key: "Enter" });
    expect(prefix).toHaveTextContent("+1");

    fireEvent.keyDown(prefix, { key: "Escape" });
    expect(prefix).toHaveAttribute("aria-expanded", "false");
  });
});
