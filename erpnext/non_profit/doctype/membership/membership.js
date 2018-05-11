// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Membership', {
	onload:function(frm) {
		frm.add_fetch('membership_type', 'amount', 'amount');
	}
});

frappe.ui.form.on("Membership", "membership_type", function(frm, cdt, cdn) {

if(frm.doc.membership_validity){
		 frappe.call({
        method: "gscommunity.gscommunity.doctype.sponsors.sponsors.add_months",
        args: {
      "date":frm.doc.from_date,
      "months":frm.doc.membership_validity,
        },
        callback: function(r) {
        	if(r){
        		frm.set_value("to_date", r.message);
        	}
		
	}
})
}

});

frappe.ui.form.on("Membership", "paid", function(frm, cdt, cdn) {
if(frm.doc.paid == "1"){
		
		frm.set_value("member_since_date",frappe.datetime.nowdate());
}

});