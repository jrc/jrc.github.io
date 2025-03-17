// Constants and Configuration
const CONFIG = {
  nodeRadius: 5,
  // linkDistance: 300,
  chargeStrength: -650,
  collisionRadius: 50,
  tooltipWidth: 200,
  maxZoomLevel: 3,
  maxHops: 2,
  opacityDecrement: 0.4,
  arrowMarkerSize: 6,
  zoomDuration: 750,
  zoomPadding: 50,
};

// Color scale for nodes
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// SVG and force simulation setup
const svg = d3.select("#graph");
const g = svg.append("g");
const simulation = createForceSimulation();

// Zoom behavior
const zoom = createZoomBehavior();
svg.call(zoom).on("dblclick.zoom", null);

// Touch event listeners
svg
  .on("touchstart", handleTouchStart)
  .on("touchmove", handleTouchMove)
  .on("touchend", handleTouchEnd);

let lastTouchY, touchStartTime, isSwiping;

// Main update function
function updateGraph(nodes, links) {
  if (!Array.isArray(nodes) || !Array.isArray(links)) {
    console.error("Invalid data provided to updateGraph");
    return;
  }

  simulation.nodes(nodes);
  simulation.force("link").links(links);

  updateLinks(links);
  updateNodes(nodes);

  simulation.alpha(1).restart();
}

// Create force simulation
function createForceSimulation() {
  return (
    d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id((d) => d.id)
        // .distance(CONFIG.linkDistance)
      )
      .force("charge", d3.forceManyBody().strength(CONFIG.chargeStrength))
      // .force("center", d3.forceCenter())
      .force("collision", d3.forceCollide().radius(CONFIG.collisionRadius))
      .on("tick", ticked)
  );
}

// Create zoom behavior
function createZoomBehavior() {
  return d3
    .zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", (event) => g.attr("transform", event.transform));
}

function createArrowMarker() {
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", "#999")
    .style("stroke", "none");
}

// Update links
function updateLinks(links) {
  const linkGroup = g.selectAll(".link-group").data([null]);
  linkGroup.enter().append("g").attr("class", "link-group");

  const link = g
    .select(".link-group")
    .selectAll(".link")
    .data(links, (d) => `${d.source.id}-${d.target.id}`);

  link.exit().remove();

  const linkEnter = link
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("marker-end", "url(#arrowhead)"); // Add this line to use the arrowhead marker

  link
    .merge(linkEnter)
    .on("mouseover", function (event, d) {
      highlightLinkAndNodes(d);
    })
    .on("mouseout", resetHighlight);
}

// Update nodes
function updateNodes(nodes) {
  const nodeGroup = g.selectAll(".node-group").data([null]);
  nodeGroup.enter().append("g").attr("class", "node-group");

  const node = g
    .select(".node-group")
    .selectAll(".node")
    .data(nodes, (d) => d.id);

  node.exit().remove();

  const nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .call(drag(simulation));

  nodeEnter
    .append("circle")
    .attr("r", CONFIG.nodeRadius)
    .attr("fill", (d) => colorScale(d.tags[0]));

  nodeEnter
    .append("text")
    .attr("dx", 8)
    .attr("dy", ".35em")
    .text((d) => d.name);

  node
    .merge(nodeEnter)
    .on("mouseover", function (event, d) {
      highlightNodeAndNeighbors(d);
      showTooltip(event, d);
    })
    .on("mouseout", function () {
      resetHighlight();
      hideTooltip();
    })
    .on("click", (event, d) => {
      if (d.url) window.open(d.url, "_blank");
    });
}

// Drag behavior
function drag(simulation) {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

// Touch event handlers
function handleTouchStart(event) {
  lastTouchY = event.touches[0].clientY;
  touchStartTime = new Date().getTime();
  isSwiping = false;
}

function handleTouchMove(event) {
  const currentY = event.touches[0].clientY;
  const deltaY = currentY - lastTouchY;

  if (Math.abs(deltaY) > 10) {
    isSwiping = true;
    const tagFilters = document.getElementById("tag-filters");
    tagFilters.scrollTop -= deltaY;
  }

  lastTouchY = currentY;
}

function handleTouchEnd(event) {
  const touchEndTime = new Date().getTime();
  const touchDuration = touchEndTime - touchStartTime;

  if (!isSwiping && touchDuration < 300) {
    handleTap(event);
  }
}

function handleTap(event) {
  const [x, y] = d3.pointer(event, svg.node());
  const transform = d3.zoomTransform(svg.node());
  const invertedX = transform.invertX(x);
  const invertedY = transform.invertY(y);

  const tappedNode = simulation.find(
    invertedX,
    invertedY,
    CONFIG.nodeRadius * 2
  );

  if (tappedNode) {
    highlightNodeAndNeighbors(tappedNode);
    showTooltip(event, tappedNode);
  } else {
    resetHighlight();
    hideTooltip();
  }
}

// Tooltip functions
function showTooltip(event, d) {
  const tooltip = d3.select("#tooltip");
  let left, top;

  if (event.type === "touchend") {
    left = d.x;
    top = d.y - 100;
  } else {
    left = event.pageX + 10;
    top = event.pageY + 10;
  }

  if (left + CONFIG.tooltipWidth > window.innerWidth) {
    left = window.innerWidth - CONFIG.tooltipWidth - 10;
  }

  tooltip
    .style("display", "block")
    .html(createTooltipContent(d))
    .style("left", `${left}px`)
    .style("top", `${top}px`);
}

function createTooltipContent(d) {
  return `
    <strong>${d.name} (${d.year})</strong><br>
    <span class="tooltip-description">${
      d.description || "No description available"
    }</span><br>
    <span class="tooltip-tags">Tags: ${
      d.tags ? d.tags.join(", ") : "No tags"
    }</span><br>
    <span class="tooltip-url">${d.url || "No URL available"}</span>
  `;
}

function hideTooltip() {
  d3.select("#tooltip").style("display", "none");
}

// Zoom to fit function
function zoomToFit(nodePositions) {
  if (!Array.isArray(nodePositions) || nodePositions.length === 0) {
    console.warn("Invalid or empty nodePositions provided to zoomToFit");
    return;
  }

  const bounds = calculateBounds(nodePositions);
  const { scale, translateX, translateY } = calculateZoomParameters(bounds);

  svg
    .transition()
    .duration(CONFIG.zoomDuration)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(translateX, translateY).scale(scale)
    );
}

function calculateBounds(nodePositions) {
  return {
    left: d3.min(nodePositions, (d) => d[0]),
    right: d3.max(nodePositions, (d) => d[0]),
    top: d3.min(nodePositions, (d) => d[1]),
    bottom: d3.max(nodePositions, (d) => d[1]),
  };
}

function calculateZoomParameters(bounds) {
  const { width, height } = svg.node().getBoundingClientRect();
  const boundsWidth = bounds.right - bounds.left;
  const boundsHeight = bounds.bottom - bounds.top;

  const scale = Math.min(
    (width - CONFIG.zoomPadding * 2) / boundsWidth,
    (height - CONFIG.zoomPadding * 2) / boundsHeight,
    CONFIG.maxZoomLevel
  );

  const translateX = (width - boundsWidth * scale) / 2 - bounds.left * scale;
  const translateY = (height - boundsHeight * scale) / 2 - bounds.top * scale;

  return { scale, translateX, translateY };
}

// Calculate distances from a node
function calculateDistances(startNode, nodes, links) {
  const distances = new Map();
  distances.set(startNode.id, 0);

  const queue = [startNode];
  while (queue.length > 0) {
    const currentNode = queue.shift();
    const currentDistance = distances.get(currentNode.id);

    if (currentDistance >= CONFIG.maxHops) continue; // Stop at maxHops

    links.forEach((link) => {
      let nextNode;
      if (link.source.id === currentNode.id) {
        nextNode = link.target;
      } else if (link.target.id === currentNode.id) {
        nextNode = link.source;
      }

      if (nextNode && !distances.has(nextNode.id)) {
        distances.set(nextNode.id, currentDistance + 1);
        queue.push(nextNode);
      }
    });
  }

  return distances;
}

// Highlight functions
function applyHighlight(hoveredNode = null, hoveredLink = null) {
  const activeTags = getActiveTags();

  if (activeTags.length === 0 && !hoveredNode && !hoveredLink) {
    clearHighlight();
    return;
  }

  const distances = hoveredNode
    ? calculateDistances(
        hoveredNode,
        simulation.nodes(),
        simulation.force("link").links()
      )
    : null;

  highlightNodes(hoveredNode, hoveredLink, distances, activeTags);
  highlightLinks(hoveredNode, hoveredLink, distances, activeTags);

  if (hoveredNode) {
    g.selectAll(".node")
      .filter((d) => d === hoveredNode)
      .select("circle")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);
  }
}

function _calculateNodeOpacity(link, distances) {
  const distance = distances.get(link.id);
  if (distance !== undefined) {
    return 1 - distance * CONFIG.opacityDecrement;
  }
  return 0.1;
}

function highlightNodes(hoveredNode, hoveredLink, distances, activeTags) {
  g.selectAll(".node").attr("opacity", (d) => {
    if (hoveredNode) {
      return _calculateNodeOpacity(d, distances);
    }
    if (hoveredLink) {
      return d === hoveredLink.source || d === hoveredLink.target ? 1 : 0.1;
    }
    return d.tags && d.tags.some((tag) => activeTags.includes(tag)) ? 1 : 0.1;
  });
}

function _calculateLinkOpacity(link, distances) {
  const sourceDistance = distances.get(link.source.id);
  const targetDistance = distances.get(link.target.id);
  if (sourceDistance !== undefined && targetDistance !== undefined) {
    const maxDistance = Math.max(sourceDistance, targetDistance);
    return 1 - maxDistance * CONFIG.opacityDecrement;
  }
  return 0.1;
}

function _calculateLinkOpacityByTags(link, activeTags) {
  return (link.source.tags &&
    link.source.tags.some((tag) => activeTags.includes(tag))) ||
    (link.target.tags &&
      link.target.tags.some((tag) => activeTags.includes(tag)))
    ? 0.5
    : 0.1;
}

function highlightLinks(hoveredNode, hoveredLink, distances, activeTags) {
  g.selectAll(".link")
    .attr("opacity", (d) => {
      if (hoveredNode) {
        return _calculateLinkOpacity(d, distances);
      }
      if (hoveredLink) {
        return d === hoveredLink ? 1 : 0.1;
      }
      return _calculateLinkOpacityByTags(d, activeTags);
    })
    .attr("stroke-width", (d) => {
      if (hoveredNode) {
        return distances.has(d.source.id) && distances.has(d.target.id) ? 2 : 1;
      }
      if (hoveredLink) {
        return d === hoveredLink ? 2 : 1;
      }
      return 1;
    });
}

function clearHighlight() {
  g.selectAll(".node").attr("opacity", 1);
  g.selectAll(".link").attr("opacity", 0.6).attr("stroke-width", 1);
  g.selectAll(".node circle").attr("stroke", null).attr("stroke-width", null);
}

function highlightNodeAndNeighbors(d) {
  applyHighlight(d);
}

function highlightLinkAndNodes(d) {
  applyHighlight(null, d);
}

function resetHighlight() {
  applyHighlight();
}

// Tag highlight functions
function toggleTagHighlight(tag) {
  if (typeof tag !== "string" || tag.trim() === "") {
    console.error("Invalid tag provided to toggleTagHighlight");
    return;
  }

  const button = document.querySelector(`button[data-tag="${tag}"]`);
  button.classList.toggle("active");

  applyHighlight();

  const activeTags = getActiveTags();
  if (activeTags.length > 0) {
    const highlightedNodes = g
      .selectAll(".node")
      .filter((d) => d.tags && d.tags.some((tag) => activeTags.includes(tag)));

    const nodePositions = highlightedNodes.data().map((d) => [d.x, d.y]);
    zoomToFit(nodePositions);
  }
}

function getActiveTags() {
  return Array.from(
    document.querySelectorAll("#tag-filters button.active")
  ).map((button) => button.dataset.tag);
}

// Create tag buttons
function createTagButtons() {
  const tagFilters = document.getElementById("tag-filters");
  if (!tagFilters) {
    console.error("Tag filters container not found");
    return;
  }

  tagFilters.innerHTML = "";

  const uniqueTags = getUniqueTags(allNodes);

  uniqueTags.forEach(({ tag, count }) => {
    const button = document.createElement("button");
    button.innerHTML = `<span class="color-bubble" style="background-color: ${colorScale(
      tag
    )}"></span> ${tag} (${count})`;
    button.dataset.tag = tag;
    button.addEventListener("click", () => toggleTagHighlight(tag));
    tagFilters.appendChild(button);
  });
}

// Helper function to get unique tags
function getUniqueTags(nodes) {
  const tagCounts = {};
  nodes.forEach((node) => {
    if (node.tags) {
      node.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
}

// Simulation tick function
function ticked() {
  updateLinkPositions();
  updateNodePositions();
}

function updateLinkPositions() {
  g.select(".link-group")
    .selectAll(".link")
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => calculateLinkEndX(d))
    .attr("y2", (d) => calculateLinkEndY(d));
}

function calculateLinkEndX(d) {
  const dx = d.target.x - d.source.x;
  const dy = d.target.y - d.source.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  return d.source.x + (dx / length) * (length - CONFIG.arrowMarkerSize);
}

function calculateLinkEndY(d) {
  const dx = d.target.x - d.source.x;
  const dy = d.target.y - d.source.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  return d.source.y + (dy / length) * (length - CONFIG.arrowMarkerSize);
}

function updateNodePositions() {
  g.select(".node-group")
    .selectAll(".node")
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
}

// Initialize the graph
function initializeGraph({ nodes, links }) {
  if (!Array.isArray(nodes) || !Array.isArray(links)) {
    console.error("Invalid data provided to initializeGraph");
    return;
  }

  createArrowMarker();
  updateGraph(nodes, links);
  createTagButtons();
}

// Function to initialize the graph with provided nodes
function initializeGraphWithNodes(allNodes) {
  const links = createLinksFromNodes(allNodes);
  initializeGraph({ nodes: allNodes, links: links });
}

function createLinksFromNodes(allNodes) {
  const links = [];
  allNodes.forEach((node) => {
    if (node.dependsOn) {
      node.dependsOn.forEach((influencer) => {
        const source = allNodes.find((n) => n.id === influencer);
        if (source) {
          links.push({ source: source.id, target: node.id });
        }
      });
    }
  });
  return links;
}

// Add responsive layout function
function updateLayout() {
  const { width, height } = svg.node().getBoundingClientRect();
  const isMobile = width <= 768;

  updateSVGDimensions(width, height);
  updateControlsLayout(isMobile);
  updateSimulationCenter(width, height);
}

function updateSVGDimensions(width, height) {
  svg.attr("width", width).attr("height", height);
}

function updateControlsLayout(isMobile) {
  const controls = d3.select("#controls");
  if (isMobile) {
    controls.style("width", "90%").style("height", "20vh");
  } else {
    controls.style("width", "250px").style("height", "100%");
  }
}

function updateSimulationCenter(width, height) {
  simulation.force("center", d3.forceCenter(width / 2, height / 2));
  simulation.alpha(1).restart();
}

// Event listeners
window.addEventListener("resize", updateLayout);

// Initialize the graph with provided nodes
initializeGraphWithNodes(allNodes);

// Initialize layout
updateLayout();
