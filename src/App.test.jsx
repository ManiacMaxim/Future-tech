import { render, screen } from "@testing-library/react";
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
});
