import React, {createContext, useContext, useEffect, useState} from 'react';
import './variables.css';
import "allotment/dist/style.css";
import './OpenAPIChanges.css';
import {Col, ConfigProvider, Row, Tabs, theme} from 'antd';
import {Header} from "./components/header";
import {ReportContainer} from "./components/report-statistics/ReportContainer";
import {GraphViewComponent} from "@/components/graph/GraphView";
import {TreeViewComponent} from "@/components/tree/TreeView";
import {ChangeState, DrawerState, ReportState, useChangeStore, useDrawerStore, useReportStore,} from "@/model/store";
import {BeefyTreeNode} from "@/model";
import {NodeData} from "reaflow";
import {TreeGraphMap} from "@/model/graph";
import {lookAtGraph, lookAtTree} from "@/utils/utils";
import {Report, ReportItem} from "@/model/report";
import {StoreApi, useStore, createStore} from "zustand";

export interface OpenAPIChangesProps {
    report: Report;
}

export let ReportStoreContext: React.Context<StoreApi<ReportState>>

function OpenAPIChanges(props: OpenAPIChangesProps) {
    const closeDrawer = useDrawerStore((state: DrawerState) => state.closeDrawer)
    const nodeMap: Map<String, TreeGraphMap> = new Map<String, TreeGraphMap>();
    const lookupMap = useChangeStore((state: ChangeState) => state.treeMapLookup)
    const treeData: BeefyTreeNode[] | undefined  = useReportStore((report: ReportState) => report.selectedReportItem?.tree)
    const graphData: NodeData[] | undefined = useReportStore((report: ReportState) => report.selectedReportItem?.graph?.nodes)

    if (treeData) {
        treeData.forEach((btn: BeefyTreeNode) => {
            lookAtTree(btn, nodeMap);
        })
    }
    if (graphData) {
        graphData.forEach((node: NodeData) => {
            lookAtGraph(node, nodeMap)
        })
    }

    nodeMap.forEach((item) => {
        if (item.graphNode && item.treeNode && item.treeNode.key) {
            if (typeof item.treeNode.key === 'string') {
                lookupMap.set(item.graphNode?.id, item.treeNode.key)
            }
        }
    });

    return (

            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        fontFamily: 'var(--font-stack)',
                        fontSize: 14,
                        colorPrimary: 'rgba(98, 196, 255, 1.0)',
                        colorPrimaryActive: '#b685ff',
                    },
                }}
            >
                <div id="main_container">
                    <section className="report-header">
                        <Header/>
                        <hr/>
                        <Row>
                            <Col span={24}>
                                <ReportContainer/>
                            </Col>
                        </Row>
                        <hr/>
                    </section>

                    <section className="report-changes">
                        <Tabs
                            destroyInactiveTabPane={true}
                            defaultActiveKey="1"
                            type="card"
                            onChange={closeDrawer}
                            centered={true}
                            items={[
                                {
                                    label: `Explore Tree`,
                                    key: '1',
                                    children: <TreeViewComponent/>,
                                },
                                {
                                    label: `Explore Graph`,
                                    key: '2',
                                    children: <GraphViewComponent drawerProps={{open: true}}/>,
                                }
                            ]}
                        />
                    </section>
                    <hr/>

                    <footer>
                        Generated by <a href='https://github.com/pb33f/openapi-changes'>openapi-changes</a>&nbsp;|&nbsp;
                        Powered by <a href='https://github.com/pb33f/libopenapi'>libopenapi</a>&nbsp;|&nbsp;
                        Developed by <a href='https://github.com/pb33f'>pb33f heavy industries</a>
                    </footer>

                </div>
            </ConfigProvider>

    );
}

export default OpenAPIChanges;