# -*- coding: utf-8 -*-
# Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.contacts.address_and_contact import load_address_and_contact
from frappe.utils import getdate, add_months, add_to_date, nowdate

class Member(Document):
	def onload(self):
		"""Load address and contacts in `__onload`"""
		load_address_and_contact(self)

	def validate(self):
		self.validate_email_type(self.email)

	def validate_email_type(self, email):
		from frappe.utils import validate_email_add
		validate_email_add(email.strip(), True)
		
	def on_update(self):
		self.add_user()	
		self.add_ChildUser()
		self.add_ChildSubscriber()	
		if frappe.db.get_value("User", self.email):	
			frappe.db.set_value("User", self.email , "first_name", self.member_name)
			frappe.db.set_value("User", self.email , "email", self.email)
			frappe.db.set_value("User", self.email , "mobile_no", self.phone_no)

		for d in self.get('table_25'):
			frappe.db.set_value("Member", d.email , "member_name", d.member_name)
			frappe.db.set_value("Member", d.email , "email", d.email)
			frappe.db.set_value("Member", d.email , "phone_no", d.phone_no)
			if not frappe.db.get_value("User", d.email):
				result= frappe.get_doc({
				"doctype": "User",
				"email": d.email,
				"first_name": d.member_name,
				"mobile_no":d.phone_no,
				"send_welcome_email":1
				}).insert()
				return result
		
		
	def add_parentrole(self):
		 result= frappe.get_doc({
		  "doctype": "Has Role",
		  "name": nowdate(),
		  "parent": self.email,
		  "parentfield": "roles",
		  "parenttype": "User",
		  "role": "Non Profit Member"
		 }).insert()
		 return result
	
	def add_user(self):
		if not frappe.db.get_value("User", self.email):
			result= frappe.get_doc({
			"doctype": "User",
			"email": self.email,
			"first_name": self.member_name,
			"mobile_no":self.phone_no,
			"send_welcome_email":1
			}).insert()
			self.add_parentrole()
			return result

	def add_ChildUser(self):
		if not frappe.db.get_value("Member", self.email):
			for d in self.get('table_25'):
				result= frappe.get_doc({
				 "doctype":"Member",
				 "member_name":d.member_name,
				 "email":d.email,
				 "phone_no":d.phone_no,
				 "membership_type":self.membership_type,
				 "membership_expiry_date":self.membership_expiry_date
				}).insert()
				return result
	
	def add_ChildSubscriber(self):
		for d in self.get('table_25'):
			if not frappe.db.get_value("Email Group Member", d.email):
				result= frappe.get_doc({
				 "doctype":"Email Group Member",
				 "email_group":d.newsletter,
				 "email":d.email
				}).insert()
				return result
				