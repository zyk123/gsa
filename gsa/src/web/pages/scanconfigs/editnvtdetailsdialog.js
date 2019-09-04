/* Copyright (C) 2017-2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import React from 'react';

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes';

import SeverityBar from 'web/components/bar/severitybar';

import DateTime from 'web/components/date/datetime';

import SaveDialog from 'web/components/dialog/savedialog';

import Radio from 'web/components/form/radio';
import TextField from 'web/components/form/textfield';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';
import Link from 'web/components/link/link';

import SimpleTable from 'web/components/table/simpletable';
import Table from 'web/components/table/stripedtable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableHead from 'web/components/table/head';
import TableHeader from 'web/components/table/header';
import TableRow from 'web/components/table/row';

import NvtPreference from '../nvts/nvtpreference';
import Preformatted from '../nvts/preformatted';

const EditDialog = ({
  configId,
  configName,
  configNameLabel,
  defaultTimeout,
  nvtAffectedSoftware,
  nvtCvssVector,
  nvtFamily,
  nvtLastModified,
  nvtName,
  nvtOid,
  nvtSeverity,
  nvtSummary,
  timeout,
  preferences,
  preferenceValues,
  title,
  onClose,
  onSave,
}) => {
  const controlledData = {
    configId,
    nvtOid,
    preferenceValues,
  };

  return (
    <SaveDialog
      title={title}
      onClose={onClose}
      onSave={onSave}
      defaultValues={{
        timeout: isDefined(timeout) ? timeout : '',
        useDefaultTimeout: isDefined(timeout) ? '0' : '1',
      }}
      values={controlledData}
    >
      {({values: state, onValueChange}) => (
        <Layout flex="column">
          <SimpleTable>
            <TableBody>
              <TableRow>
                <TableData>{_('Name')}</TableData>
                <TableData>
                  <span>
                    <DetailsLink id={nvtOid} type="nvt">
                      {nvtName}
                    </DetailsLink>
                  </span>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>{configNameLabel}</TableData>
                <TableData>{configName}</TableData>
              </TableRow>
              <TableRow>
                <TableData>{_('Family')}</TableData>
                <TableData>{nvtFamily}</TableData>
              </TableRow>
              <TableRow>
                <TableData>{_('OID')}</TableData>
                <TableData>{nvtOid}</TableData>
              </TableRow>
              <TableRow>
                <TableData>{_('Last Modified')}</TableData>
                <TableData>
                  <DateTime date={nvtLastModified} />
                </TableData>
              </TableRow>
            </TableBody>
          </SimpleTable>

          {isDefined(nvtSummary) && (
            <div>
              <h1>{_('Summary')}</h1>
              <Preformatted>{nvtSummary}</Preformatted>
            </div>
          )}

          {isDefined(nvtAffectedSoftware) && (
            <div>
              <h1>{_('Affected Software/OS')}</h1>
              <Preformatted>{nvtAffectedSoftware}</Preformatted>
            </div>
          )}

          <div>
            <h1>{_('Vulnerability Scoring')}</h1>
            <SimpleTable>
              <TableBody>
                <TableRow>
                  <TableData>{_('CVSS base')}</TableData>
                  <TableData>
                    <SeverityBar severity={nvtSeverity} />
                  </TableData>
                </TableRow>
                {isDefined(nvtCvssVector) && (
                  <TableRow>
                    <TableData>{_('CVSS base vector')}</TableData>
                    <TableData>
                      <Link
                        to="cvsscalculator"
                        query={{cvssVector: nvtCvssVector}}
                      >
                        {nvtCvssVector}
                      </Link>
                    </TableData>
                  </TableRow>
                )}
              </TableBody>
            </SimpleTable>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_('Name')}</TableHead>
                <TableHead>{_('New Value')}</TableHead>
                <TableHead>{_('Default Value')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableData>{_('Timeout')}</TableData>
                <TableData>
                  <Divider flex="column">
                    <Divider>
                      <Radio
                        value="1"
                        name="useDefaultTimeout"
                        checked={state.useDefaultTimeout === '1'}
                        onChange={onValueChange}
                      />
                      <span>
                        {_('Apply default timeout')}
                        {isDefined(defaultTimeout)
                          ? ' (' + defaultTimeout + ')'
                          : ''}
                      </span>
                    </Divider>
                    <Divider>
                      <Radio
                        value="0"
                        name="useDefaultTimeout"
                        checked={state.useDefaultTimeout === '0'}
                        onChange={onValueChange}
                      />
                      <TextField
                        disabled={state.useDefaultTimeout === '1'}
                        name="timeout"
                        value={state.timeout}
                        onChange={onValueChange}
                      />
                    </Divider>
                  </Divider>
                </TableData>
                <TableData>
                  {isDefined(defaultTimeout) ? defaultTimeout : ''}
                </TableData>
              </TableRow>
              {preferences.map(pref => {
                const prefValue = isDefined(preferenceValues[pref.name])
                  ? preferenceValues[pref.name].value
                  : undefined;
                return (
                  <NvtPreference
                    key={pref.name}
                    preference={pref}
                    value={prefValue}
                    onChange={value => {
                      preferenceValues[pref.name].value = value.value;
                    }}
                  />
                );
              })}
            </TableBody>
          </Table>
        </Layout>
      )}
    </SaveDialog>
  );
};

EditDialog.propTypes = {
  configId: PropTypes.string.isRequired,
  configName: PropTypes.string.isRequired,
  configNameLabel: PropTypes.string.isRequired,
  defaultTimeout: PropTypes.number,
  nvtAffectedSoftware: PropTypes.string,
  nvtCvssVector: PropTypes.string,
  nvtFamily: PropTypes.string,
  nvtLastModified: PropTypes.date,
  nvtName: PropTypes.string,
  nvtOid: PropTypes.string,
  nvtSeverity: PropTypes.number,
  nvtSummary: PropTypes.string,
  preferenceValues: PropTypes.object.isRequired,
  preferences: PropTypes.arrayOf(
    PropTypes.shape({
      default: PropTypes.any,
      hr_name: PropTypes.string,
      name: PropTypes.string.isRequired,
      value: PropTypes.any,
    }),
  ),
  timeout: PropTypes.number,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditDialog;

// vim: set ts=2 sw=2 tw=80:
