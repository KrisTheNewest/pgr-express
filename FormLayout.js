module.exports = class Form {
	chara      = false;
	costume    = false;
	price      = false;
	event      = false;
	schara     = false;
    scost      = false;
	disbled    = false;
	error      = false;
	success    = false;

    displayChara() {
        this.chara      = true;
    }
	displayCostume() {
        this.costume    = true;
    }
	displayPrice() {
        this.price      = true;
    }
	displayEvent() {
        this.event      = true;
    }
	selectChara() {
        this.schara     = true;
    }
    selectCostume() {
        this.scost      = true;
    }
    //fields are disabled as event is not required
	disableFields() {
		this.disbled    = true;
	}
    // error = true means data to be displayed is required
    // its better to keep both as a single method
    // to avoid forgetting either
    setError(res) {
        this.error      = true;
        this.res        = res;
    }
    setSuccess(res) {
        this.success       = true;
        this.res        = res;
    }
	setData(data) {
        this.data       = data;
    }
}