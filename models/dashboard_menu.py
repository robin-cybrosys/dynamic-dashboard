# -*- coding: utf-8 -*-
#############################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#
#    Copyright (C) 2021-TODAY Cybrosys Technologies(<https://www.cybrosys.com>)
#    Author: Cybrosys Techno Solutions(<https://www.cybrosys.com>)
#
#    You can modify it under the terms of the GNU LESSER
#    GENERAL PUBLIC LICENSE (LGPL v3), Version 3.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU LESSER GENERAL PUBLIC LICENSE (LGPL v3) for more details.
#
#    You should have received a copy of the GNU LESSER GENERAL PUBLIC LICENSE
#    (LGPL v3) along with this program.
#    If not, see <http://www.gnu.org/licenses/>.
#
#############################################################################

from odoo import models, fields, api
from odoo.osv import expression


class DashboardMenu(models.Model):
    _name = "dashboard.menu"
    _description = "Dashboard Menu"
    _rec_name = "name"

    def _default_menu_id(self):
        print(self.env.context.get('active_id'))
        return self.env['ir.ui.menu'].search(
            [('name', '=', 'Dynamic Dashboards')])

    name = fields.Char(string="Name", ondelete='cascade')
    menu_id = fields.Many2one('ir.ui.menu', string="Parent Menu",
                              default=lambda s: s._default_menu_id(),
                              help="Parent Menu Location of New Dashboard",
                              ondelete='cascade')
    group_ids = fields.Many2many('res.groups', string='Groups',
                                 related='menu_id.groups_id',
                                 help="User need to be at least in one of these groups to see the menu")
    client_action = fields.Many2one('ir.actions.client')

    @api.model
    def create(self, vals):
        """create new dashboard"""
        values = {
            'name': vals['name'],
            'tag': 'dynamic_odoo_dashboard',
        }
        action_id = self.env['ir.actions.client'].create(values)
        vals['client_action'] = action_id.id
        menu_id = self.env['ir.ui.menu'].create({
            'name': vals['name'],
            'parent_id': vals['menu_id'],
            'action': 'ir.actions.client,%d' % (action_id.id,)
        })
        return super(DashboardMenu, self).create(vals)

    def write(self, vals):
        """edit dashboard"""
        for rec in self:
            client_act_id = rec['client_action'].id
            client_act_id = f'ir.actions.client,{client_act_id}'
            menu = self.env['ir.ui.menu'].search(
                [('parent_id', '=', rec['menu_id'].id),
                 ('action', '=', client_act_id)])
            for i in menu:
                print(i.read())
            name = vals['name'] if 'name' in vals.keys() else rec['name']
            parent_menu_id = vals['menu_id'] if 'menu_id' in vals.keys() else \
            rec['menu_id']
            menu.write({
                'name': name,
                'parent_id': parent_menu_id,
                'action': client_act_id
            })
        return super(DashboardMenu, self).write(vals)

    def unlink(self):
        """delete dashboard along with menu item"""
        for rec in self:
            client_act_id = rec['client_action'].id
            client_act_id = f'ir.actions.client,{client_act_id}'
            menu = self.env['ir.ui.menu'].search(
                [('parent_id', '=', rec['menu_id'].id),
                 ('action', '=', client_act_id)])
            menu.unlink()
        return super(DashboardMenu, self).unlink()
