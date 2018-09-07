import * as vega from 'vega';
import {
    Renderers,
    Scene,
    SceneGroup,
    SceneItem,
    SceneLegendItem,
    SceneLine,
    SceneRect,
    SceneSymbol,
    SceneText
} from 'vega';

interface SceneRenderer {
    (scene: Scene): void;
}

const group: SceneRenderer = (outerScene: Scene) => {
    vega.sceneVisit(outerScene, sceneGroupOrItem => {
        const group = sceneGroupOrItem as SceneGroup;
        vega.sceneVisit(group, item => {
            const innerScene = item as Scene;
            rootRenderer(innerScene);
        });
    });
};

const rect: SceneRenderer = (scene: Scene) => {
    vega.sceneVisit(scene, sceneGroupOrItem => {
        const rect = sceneGroupOrItem as SceneRect;
        rect.fill;
        rect.height;
        rect.width;
        rect.x;
        rect.y;
    });
};


const legend: SceneRenderer = (scene: Scene) => {
    const legendMap: { [role: string]: (item: SceneItem) => void } = {
        'legend-title': item => {
            const textItem = item as SceneText;
            textItem.text;
        },
        'legend-symbol': item => {
            const symbol = item as SceneSymbol & SceneLegendItem;
            symbol.datum;
            symbol.shape;
            symbol.size;
        }
    };
    vega.sceneVisit(scene, sceneGroupOrItem => {
        const sceneItem = sceneGroupOrItem as SceneItem;
        legendMap[sceneItem.mark.role](sceneItem);
    });
};

const rule: SceneRenderer = (scene: Scene) => {
    vega.sceneVisit(scene, sceneGroupOrItem => {
        const line = sceneGroupOrItem as SceneLine;
        line.x;
        line.y;
        line.x2;
        line.y2;
    });
};

const text: SceneRenderer = (scene: Scene) => {
    vega.sceneVisit(scene, sceneGroupOrItem => {
        const text = sceneGroupOrItem as SceneText;
        text.align;
        text.angle;
        text.baseline;
        text.fill;
        text.font;
        text.fontSize;
        text.text;
        text.x;
        text.y;
    });
};

const sceneRenderers: { [id: string]: SceneRenderer } = {
    group,
    legend,
    rect,
    rule,
    text
};

const rootRenderer: SceneRenderer = (scene: Scene) => {
    const renderer = sceneRenderers[scene.marktype];
    renderer(scene);
}

class TestRenderer extends vega.Renderer {
    _render(scene: Scene, items: SceneItem[]) {
        rootRenderer(scene);
        //return this for vega
        return this;
    }
}

class TestView extends vega.View {
    renderer(renderer: Renderers | 'test') {
        return super.renderer(renderer as Renderers);
    }
}

vega.renderModule('test', { handler: vega.CanvasHandler, renderer: TestRenderer });
