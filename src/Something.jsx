import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const DynamicTreeGridWithAggregation = () => {
  const [columnDefs] = useState([
    { field: "variableId", hide: true },
    { field: "variableName", hide: true },
    { field: "trendLine" },
    { field: "variableType" },
    { field: "t_1"},
    { field: "t_2"},
    { field: "t_3"},
    { field: "t_4"},
  ]);

  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    if (gridApi) {
      const fakeServerData = [
        {
          "variableId": 1,
          "variableName": "Max Revenue",
          "trendLine": "[1,2,7,4,5]",
          "variableType": "Float",
          "t_1":2,
          "t_2":4,
          "t_3":6,
          "t_4":5,
          "children": [
            {
              "variableId": 2,
              "variableName": "Direct to Consumer",
              "trendLine": "[2,1,3,5,2]",
              "variableType": "Object",
              "t_1":2,
              "t_2":4,
              "t_3":6,
              "t_4":5,
              "children": [
                {
                  "variableId": 3,
                  "variableName": "Product 1",
                  "trendLine": "[1,2,6,7,7]",
                  "variableType": "String",
                  "t_1":2,
                  "t_2":4,
                  "t_3":6,
                  "t_4":5,
                },
                {
                  "variableId": 4,
                  "variableName": "Product 2",
                  "trendLine": "[6,5,1,8,9]",
                  "variableType": "String",
                  "t_1":2,
                  "t_2":3,
                  "t_3":5,
                  "t_4":7,
                }
              ]
            }
          ]
        },
        {
          "variableId": 5,
          "variableName": "Outbound Sales",
          "trendLine": "[2,3,4,3,3]",
          "variableType": "Float",
          "t_1":2,
          "t_2":4,
          "t_3":6,
          "t_4":5,
          "children": []
        }
      ];

      const fakeServer = createFakeServer(fakeServerData);
      const datasource = getServerSideDatasource(fakeServer);
      gridApi.setGridOption('serverSideDatasource', datasource);
    }
  }, [gridApi]);

  const createFakeServer = (fakeServerData) => {
    const fakeServer = {
      data: fakeServerData,
      getData: function (request) {
        function extractRowsFromData(groupKeys, data) {
          if (groupKeys.length === 0) {
            return data.map(function (d) {
              return {
                group: !!d.children,
                variableId: d.variableId,
                variableName: d.variableName,
                variableType: d.variableType,
                trendLine: d.trendLine,
                t_1: d.t_1,
                t_2: d.t_2,
                t_3: d.t_3,
                t_4: d.t_4,
              };
            });
          }

          const key = groupKeys[0];
          for (let i = 0; i < data.length; i++) {
            if (data[i].variableId === key) {
              return extractRowsFromData(
                groupKeys.slice(1),
                data[i].children.slice()
              );
            }
          }
        }
        
        // console.log(extractRowsFromData(request.groupKeys, this.data));
        return extractRowsFromData(request.groupKeys, this.data);
      },
    };

    return fakeServer;
  };

  const getServerSideDatasource = (fakeServer) => {
    return {
      getRows: (params) => {
        // setTimeout(() => { //timeout just mimics a fake server
          const response = fakeServer.getData(params.request);
          params.success({ rowData: response });
        // }, 1000);
      },
    };
  };

  const gridOptions = {
    rowModelType: 'serverSide',
    treeData: true,
    defaultColDef: {
      width: 240,
      flex: 1,
      sortable: false,
    },
    autoGroupColumnDef: {
      field: "variableName",
      cellRendererParams: {
        innerRenderer: (params) => {
          return params.data.variableName;
        },
      },
    },
    // indicate if row is a group node
    isServerSideGroup: (dataItem) => {
      return dataItem.group;
    },
    // specify which group key to use
    getServerSideGroupKey: (dataItem) => {
      return dataItem.variableId;
    },
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        treeData={true}
        animateRows={true}
        gridOptions={gridOptions}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default DynamicTreeGridWithAggregation;
