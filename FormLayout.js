module.exports = class Form {
	chara   = false;
	costume = false;
	price   = false;
	event   = false;
	select  = false;
	disbled = false;
	error   = false;
	succ    = false;
	error   = false;
	succ    = false;

    displayChara() {
        this.chara   = true;
    }
	displayCostume() {
        this.costume = true;
    }
	displayPrice() {
        this.price   = true;
    }
	displayEvent() {
        this.event   = true;
    }
	chooseChara() {
        this.select  = true;
    }
	disableFields() {
		this.disbled = true;
	}
    setError(res) {
        this.error   = true;
        this.res     = res;
    }
    setSucc(res) {
        this.succ    = true;
        this.res     = res;
    }
	setData(data) {
        this.data    = data;
    }
};