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
});
