// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Member', {
    refresh: function(frm) {

        // frappe.dynamic_link = { doc: frm.doc, fieldname: 'name', doctype: 'Member' };

        // frm.toggle_display(['address_html', 'contact_html'], !frm.doc.__islocal);

        // if (!frm.doc.__islocal) {
        //     frappe.contacts.render_address_and_contact(frm);

            // custom buttons
            // frm.add_custom_button(__('Accounting Ledger'), function() {
            //  frappe.set_route('query-report', 'General Ledger',
            //      {party_type:'Member', party:frm.doc.name});
            // });

            // frm.add_custom_button(__('Accounts Receivable'), function() {
            //  frappe.set_route('query-report', 'Accounts Receivable', {member:frm.doc.name});
            // });

            // indicator
        //     erpnext.utils.set_party_dashboard_indicators(frm);

        // } else {
        //     frappe.contacts.clear_address_and_contact(frm);
        // }

        frappe.call({
            method: "frappe.client.get_value",
            args: {
                'doctype': "Membership",
                'filters': { 'member': frm.doc.name },
                'fieldname': [
                    'to_date'
                ]
            },
            callback: function(data) {
                if (data.message) {
                    frappe.model.set_value(frm.doctype, frm.docname,
                        "membership_expiry_date", data.message.to_date);
                }
            }
        });
    },
    // after_save: function(frm) {
    //     var membership_type=frm.doc.membership_type;
    //     var membership_expiry_date=frm.doc.membership_expiry_date;
    //           for(var i=0;i<frm.doc.table_25.length;i++) {
    //         console.log(frm.doc.table_25[i].member_name)
    //           console.log(frm.doc.table_25[i].email)
    //       var member_name= frm.doc.table_25[i].member_name;
    //         var email= frm.doc.table_25[i].email;
    //         var phone_no= frm.doc.table_25[i].phone_no;
    //         // newsletter= frm.doc.table_25[i].newsletter;
    //         // gender= frm.doc.table_25[i].gender;
    //         // date_of_birth= frm.doc.table_25[i].date_of_birth;
    //         // relation= frm.doc.table_25[i].relation;

    //             frappe.call({
    //                 method: "frappe.client.insert",
    //                 args:{
    //                     doc:{
    //                     "doctype":"Member",
    //                     "member_name":member_name,
    //                     "email":email,
    //                     "phone_no":phone_no,
    //                     "membership_type":membership_type,
    //                     "membership_expiry_date":membership_expiry_date
    //                     // "newsletter":newsletter,
    //                     // "phone_no":phone_no,
    //                     // "gender":gender,
    //                     // "date_of_birth":date_of_birth,
    //                     // "relation":relation

    //                     }
                        
    //                 },

    //                 callback: function(r) {
    //                   console.log(r.message)
    //                 }
    //             });
    //     }
    // }
        

});

frappe.ui.form.on("Member", "newsletter", function(frm, cdt, cdn) {

    if (frm.doc.newsletter != "None") {        
        frappe.call({
            method: "gscommunity.gscommunity.doctype.donation.donation.add_newsletter",
            args: {
                "emailgroup": frm.doc.newsletter,
                "email": frm.doc.email,
            },
            callback: function(r) {
                console.log(r)

            }
        })
    }

});

// frappe.ui.form.on("Other Members", "newsletter", function(frm, cdt, cdn) {
//   console.log(frm.doc.newsletter)
//   console.log(frm.doc.email)
//     if (frm.doc.newsletter != "None") {        
//         frappe.call({
//             method: "gscommunity.gscommunity.doctype.donation.donation.add_newsletter",
//             args: {
//                 "emailgroup": frm.doc.newsletter,
//                 "email": frm.doc.email,
//             },
//             callback: function(r) {
//                 console.log(r)

//             }
//         })
//     }

// });

