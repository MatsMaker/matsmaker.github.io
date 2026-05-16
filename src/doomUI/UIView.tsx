/**
 * UIView - JSX-based UI component system without React
 * Provides templates for game screens: welcome, help, pre-game ad
 */

// JSX types for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

type Props = Record<string, any> | null;
type Child = HTMLElement | string | number | null | undefined;

export class UIView {
  /**
   * JSX createElement function (used by TypeScript JSX transform)
   */
  static createElement(
    tag: string | Function,
    props: Props,
    ...children: Child[]
  ): HTMLElement {
    // Handle function components
    if (typeof tag === 'function') {
      return tag(props || {}, children);
    }

    // Create DOM element
    const element = document.createElement(tag);

    // Apply props
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value;
        } else if (key === 'id') {
          element.id = value;
        } else if (key.startsWith('on') && typeof value === 'function') {
          // Event handlers
          const eventName = key.substring(2).toLowerCase();
          element.addEventListener(eventName, value);
        } else if (key === 'style' && typeof value === 'object') {
          Object.assign(element.style, value);
        } else {
          element.setAttribute(key, value);
        }
      });
    }

    // Append children
    const appendChildren = (parent: HTMLElement, childList: Child[]) => {
      childList.forEach((child) => {
        if (!child && child !== 0) return; // Skip null/undefined
        
        if (Array.isArray(child)) {
          appendChildren(parent, child);
        } else if (child instanceof HTMLElement) {
          parent.appendChild(child);
        } else {
          parent.appendChild(document.createTextNode(String(child)));
        }
      });
    };

    appendChildren(element, children);
    return element;
  }

  /**
   * Render element to a container
   */
  static render(element: HTMLElement, container: HTMLElement): void {
    container.innerHTML = '';
    container.appendChild(element);
  }

  /**
   * Welcome Screen Component
   */
  static WelcomeScreen(): HTMLElement {
    return (
      <div className="start-prompt base">
        <p>Start the game?</p>
        <button type="button" id="btn-start-game" className="btn-green">
          Yes, start
        </button>
        <button type="button" id="btn-cancel-game" className="btn-red">
          No, thanks
        </button>
        <button type="button" id="btn-help-game" className="btn-white">
          How to play
        </button>
      </div>
    );
  }

  /**
   * Help Screen Component
   */
  static HelpScreen(): HTMLElement {
    return (
      <div className="help-prompt base">
        <h3>How to Play</h3>
        <ul>
          <li>
            Use <strong>Arrow keys</strong> to move the snake
          </li>
          <li>Eat red squares to grow and score points</li>
          <li>Avoid hitting walls and yourself</li>
          <li>
            After game over, press <strong>Backspace</strong> to return to start
          </li>
          <li>Then click Yes → watch ad → play again</li>
        </ul>
        <button type="button" id="btn-back-from-help" className="btn-white">
          Back
        </button>
      </div>
    );
  }

  /**
   * Pre-Game Ad Screen Component
   */
  static PreGameScreen(): HTMLElement {
    return (
      <div className="pre-game">
        <p className="ad-label">Advertisement</p>
        <div id="ad-container">
          <video id="ad-video" playsinline></video>
        </div>
        <p id="ad-status">Loading ad…</p>
      </div>
    );
  }

  /**
   * Clear a container
   */
  static clear(container: HTMLElement): void {
    container.innerHTML = '';
  }
}