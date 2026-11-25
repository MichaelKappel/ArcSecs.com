(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(require("./RelationalEdge.js")); }
    else { root.ArcSecsRelationalGraph = factory(root.ArcSecsRelationalEdge); }
})(typeof self !== "undefined" ? self : this, function (edgeModule) {
    "use strict";
    const RelationalEdge = edgeModule.RelationalEdge;
    class RelationalGraph {
        constructor() { this.nodes = new Map(); this.edges = new Map(); }
        addNode(id, role, massProxy) {
            const nodeId = String(id);
            if (!nodeId) { throw new Error("Node ID is required."); }
            if (this.nodes.has(nodeId)) { throw new Error("Duplicate relational entity ID: " + nodeId); }
            this.nodes.set(nodeId, { id: nodeId, role: String(role || "entity"), massProxy: Number(massProxy || 0) });
            return this;
        }
        removeNode(id) {
            const nodeId = String(id);
            this.nodes.delete(nodeId);
            Array.from(this.edges.keys()).forEach((key) => {
                const edge = this.edges.get(key);
                if (edge.fromEntityId === nodeId || edge.toEntityId === nodeId) { this.edges.delete(key); }
            });
            return this;
        }
        addEdge(fromEntityId, toEntityId, distanceParsecs, angularSeparationArcseconds, relativeVelocityKps, couplingStrength) {
            if (!this.nodes.has(String(fromEntityId)) || !this.nodes.has(String(toEntityId))) { throw new Error("Both nodes must exist before adding a relational edge."); }
            const edge = new RelationalEdge(fromEntityId, toEntityId, distanceParsecs, angularSeparationArcseconds, relativeVelocityKps, couplingStrength);
            if (this.edges.has(edge.key)) { throw new Error("Duplicate relational edge: " + edge.key); }
            this.edges.set(edge.key, edge);
            return this;
        }
        relationCount() { return this.edges.size; }
        nodeCount() { return this.nodes.size; }
        averageDistanceParsecs() {
            if (this.edges.size === 0) { return 0; }
            return Array.from(this.edges.values()).reduce((sum, edge) => sum + edge.distanceParsecs, 0) / this.edges.size;
        }
        isLeibnizVoid() { return this.nodes.size === 0 && this.edges.size === 0; }
        toJSON() { return { nodes: Array.from(this.nodes.values()), edges: Array.from(this.edges.values()).map((edge) => edge.toJSON()), leibnizVoid: this.isLeibnizVoid() }; }
        static fromJSON(json) {
            const graph = new RelationalGraph();
            (json.nodes || []).forEach((node) => graph.addNode(node.id, node.role, node.massProxy));
            (json.edges || []).forEach((edge) => graph.addEdge(edge.fromEntityId, edge.toEntityId, edge.distanceParsecs, edge.angularSeparationArcseconds, edge.relativeVelocityKps, edge.couplingStrength));
            return graph;
        }
    }
    return { RelationalGraph };
});
