import { RunDemo1 } from "../testbed/demo_1";
import { RunDemo2 } from "../testbed/demo_2";
import { Frontend } from "../testbed/frontend";

window.addEventListener("DOMContentLoaded", () => 
{
    const frontend = new Frontend();
    RunDemo2();
});