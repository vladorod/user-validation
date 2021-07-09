

class Attempts {
    
    constructor() { 
        this.storageName = "AttemptsUserValidation";
        this.storage = null;
    }

    get() { 
        const json = JSON.parse(localStorage.getItem(this.storageName));
        this.storage = json;
        return json;
    }
    isObsolete() {
        this.get();
        return this.storage?.counter >= 3;
    }
    update(obj) { 
        this.storage = obj;
        localStorage.setItem(this.storageName, JSON.stringify(obj));
        this.get();
    }
    clear() { 
        localStorage.clear(this.storageName);
        this.get();
    }
}

export default new Attempts();