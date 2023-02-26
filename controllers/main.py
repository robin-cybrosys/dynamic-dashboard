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

import random
from odoo import http
from odoo.http import request
from matplotlib import colors
import matplotlib.pyplot as plt



class DynamicDashboard(http.Controller):

    @http.route('/create/tile', type='json', auth='user')
    def tile_creation(self, **kw):
        """While clicking ADD Block"""
        type = kw.get('type')
        # r = lambda: random.randint(0, 255)
        color = plt.get_cmap('viridis')(random.random())
        color = colors.to_hex(color)
        # color = '#%06X' % random.randint(0, 256 ** 3 - 1)
        print(color,"color")
        if type == 'tile':
            name = 'New Tile'
        else:
            name = 'New Graph'
        action_id = kw.get('action_id')
        tile_id = request.env['dashboard.block'].sudo().create({
            'name': name,
            'type': type,
            'tile_color': color,
            'text_color': '#FFFFFF',
            'fa_icon': 'fa fa-bar-chart',
            'edit_mode': True,
            'client_action': int(action_id),
        })
        positions = [
            {'x': 0, 'y': 0, 'width': 6, 'height': 6},
            {'x': 6, 'y': 0, 'width': 6, 'height': 6},
            {'x': 12, 'y': 0, 'width': 6, 'height': 6},
            {'x': 18, 'y': 0, 'width': 6, 'height': 6},
        ]
        return {'id': tile_id.id, 'name': tile_id.name, 'type': type,
                'icon': 'fa fa-bar-chart',
                'color': 'background-color: %s;' % color,
                'text_color': 'color: #FFFFFF',
                'icon_color': 'color: %s' % color
                # 'item_dict':positions
                }

    @http.route('/tile/details', type='json', auth='user')
    def tile_details(self, **kw):
        tile_id = request.env['dashboard.block'].sudo().search(
            [('id', '=', kw.get('id'))])
        if tile_id:
            return {'model': tile_id.model_id.model, 'filter': tile_id.filter,
                    'model_name': tile_id.model_id.name}
        return False

    @http.route('/custom_dashboard/search_input_chart', type='json',
                auth="public", website=True)
    def dashboard_search_input_chart(self, search_input):
        chart_item_ids = request.env['dashboard.block'].search(
             [('name', 'ilike', search_input)])
        return_ids = chart_item_ids.ids
        print(return_ids,"return_ids")
        return return_ids
