import { render, screen } from "@testing-library/react";
import App from "@/App";

describe("CANUMA LP", () => {
  it("renders the main B2B message and capture CTA", () => {
    render(<App />);

    expect(screen.getByText(/Nosso foco e/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /liberar diagnostico inicial/i })).toBeInTheDocument();
  });
});
