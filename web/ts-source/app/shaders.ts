
export class shader_c {
    source: string
    
    constructor() {
        this.source = "empty"
    }

    async fetchSourceFromServer(fname: string) {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain',
            }}
    
        try {
            this.source = await fetch(fname, options).
                            then((response) => {return response.text()})
        } catch(err) {
            console.log(err);
        }
    }

    echo() {
        console.log(this.source)
    }
}
