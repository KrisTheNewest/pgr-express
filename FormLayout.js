module.exports = class Form {
	chara      = false;
	costume    = false;
	price      = false;
	event      = false;
	schara     = false;
    scost      = false;
	disbled    = false;
	error      = false;
	succ       = false;
	error      = false;
	succ       = false;

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
	disableFields() {
		this.disbled    = true;
	}
    setError(res) {
        this.error      = true;
        this.res        = res;
    }
    setSucc(res) {
        this.succ       = true;
        this.res        = res;
    }
	setData(data) {
        this.data       = data;
    }
}