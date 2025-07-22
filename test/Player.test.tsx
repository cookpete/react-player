import React from "react";
import { render } from "@testing-library/react";
import Player from "../src/Player";

// Mock the activePlayer component
const MockActivePlayer = React.forwardRef<HTMLVideoElement, any>(
  (props, ref) => {
    return React.createElement("video", { ...props, ref });
  }
);

describe("Player", () => {
  it("filters out ReactPlayer-specific event handlers to prevent React warnings", () => {
    // Mock console.warn to capture warnings
    const originalWarn = console.warn;
    const warnings: string[] = [];
    console.warn = jest.fn((...args) => {
      warnings.push(args.join(" "));
    });

    const props = {
      activePlayer: MockActivePlayer,
      onReady: jest.fn(),
      onStart: jest.fn(),
      onPlay: jest.fn(),
      onPause: jest.fn(),
      onEnded: jest.fn(),
      onLoadStart: jest.fn(),
      // These should be passed through to the underlying video element
      onLoadedMetadata: jest.fn(),
      onCanPlay: jest.fn(),
      onError: jest.fn(),
    };

    render(<Player {...props} />);

    // Check that no warnings about unknown event handlers were logged
    const unknownEventHandlerWarnings = warnings.filter((warning) =>
      warning.includes("Unknown event handler property")
    );
    expect(unknownEventHandlerWarnings).toHaveLength(0);

    // Restore console.warn
    console.warn = originalWarn;
  });

  it("passes through standard HTML video event handlers", () => {
    const props = {
      activePlayer: MockActivePlayer,
      onLoadedMetadata: jest.fn(),
      onCanPlay: jest.fn(),
      onError: jest.fn(),
    };

    const { container } = render(<Player {...props} />);
    const videoElement = container.querySelector("video");

    // Verify that standard HTML video event handlers are passed through
    expect(videoElement).toHaveProperty("onloadedmetadata");
    expect(videoElement).toHaveProperty("oncanplay");
    expect(videoElement).toHaveProperty("onerror");
  });

  it("does not pass ReactPlayer-specific event handlers to underlying video element", () => {
    const props = {
      activePlayer: MockActivePlayer,
      onReady: jest.fn(),
      onStart: jest.fn(),
      onPlay: jest.fn(),
      onPause: jest.fn(),
      onEnded: jest.fn(),
      onLoadStart: jest.fn(),
    };

    const { container } = render(<Player {...props} />);
    const videoElement = container.querySelector("video");

    // Verify that ReactPlayer-specific event handlers are NOT passed through
    expect(videoElement).not.toHaveProperty("onready");
    expect(videoElement).not.toHaveProperty("onstart");
    expect(videoElement).not.toHaveProperty("onplay");
    expect(videoElement).not.toHaveProperty("onpause");
    expect(videoElement).not.toHaveProperty("onended");
    expect(videoElement).not.toHaveProperty("onloadstart");
  });
});
