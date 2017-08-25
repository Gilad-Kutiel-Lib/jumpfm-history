import { JumpFm, Panel, Url } from 'jumpfm-api'

class History {
    maxSize
    history: Url[] = []
    panel: Panel
    i = 0

    constructor(panel: Panel, maxSize: number) {
        this.panel = panel
        this.maxSize = maxSize
        panel.onCd(this.onPanelCd)

        panel.bind('historyBack', ['alt+left'], () => {
            const url = this.back()
            url.query.history = true
            panel.cd(url)
        })

        panel.bind('historyForward', ['alt+right'], () => {
            const url = this.forward()
            url.query.history = true
            panel.cd(url)
        })
    }

    onPanelCd = () => {
        const url = this.panel.getUrl()
        if (!url.query.history) this.push(url)
    }

    push = (url: Url) => {
        this.history.splice(0, this.i);
        this.i = 0;
        this.history.unshift(url);
        this.history.splice(this.maxSize);
        return url;
    }

    forward = (): Url => {
        this.i = Math.max(0, this.i - 1);
        return this.history[this.i];
    }

    back = (): Url => {
        this.i = Math.min(this.i + 1, this.history.length - 1);
        return this.history[this.i];
    }

}

export const load = (jumpFm: JumpFm) => {
    const maxSize = jumpFm.settings.getNum('historyMaxSize', 20)
    jumpFm.panels.forEach(panel => {
        new History(panel, maxSize)
    })
}