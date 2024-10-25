// components/user-item.ts
import { JSX, Component } from "1car.us";

@Component({
  tag: "top-bar",
  shadow: true,
  styleUrl: "../components/topbar.css",
})
export class Topbar extends HTMLElement {
  render() {
    return (
      <div className="topbar">
        <a href="/">Home</a>
        <a href="/reservation/index.html">Reservation</a>
        <a href="/usa/index.html">USA</a>
        <a href="/game/index.html">Video Game</a>
      </div>
    );
  }
}

export default Topbar;
