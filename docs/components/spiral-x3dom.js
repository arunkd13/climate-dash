import { show_x3d } from "npm:@mcmcclur/x3dom-primitives"

export function spiral() {
    return show_x3d([
        create_surface((x, y) => [x, y, x ** 2 - y ** 2], [-1, 1], [-1, 1])
    ])
}
