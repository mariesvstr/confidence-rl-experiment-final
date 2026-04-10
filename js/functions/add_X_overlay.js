function addXOverlayToContainer(containerElement, color, thickness) {
  /*
  INPUTS: 
    containerElement: The HTML element to which the overlay will be added. (e.g. before calling function, you can use: const containerElement = document.getElementById('container');)
    color: The color of the overlay lines
    thickness: The thickness of the overlay lines
  */
  // Position the container relatively if it's not already
  if (getComputedStyle(containerElement).position === 'static') {
    containerElement.style.position = 'relative';
  }
  
  // Create SVG overlay
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("style", "position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  
  // Method 1: Use stroke-linecap="butt" for flat edges
  const line1 = document.createElementNS(svgNS, "line");
  line1.setAttribute("x1", "0");
  line1.setAttribute("y1", "0");
  line1.setAttribute("x2", "100");
  line1.setAttribute("y2", "100");
  line1.setAttribute("stroke", color);
  line1.setAttribute("stroke-width", thickness);
  line1.setAttribute("stroke-linecap", "butt"); // Flat ends instead of round
  
  const line2 = document.createElementNS(svgNS, "line");
  line2.setAttribute("x1", "100");
  line2.setAttribute("y1", "0");
  line2.setAttribute("x2", "0");
  line2.setAttribute("y2", "100");
  line2.setAttribute("stroke", color);
  line2.setAttribute("stroke-width", thickness);
  line2.setAttribute("stroke-linecap", "butt"); // Flat ends instead of round
  
  svg.appendChild(line1);
  svg.appendChild(line2);
  containerElement.appendChild(svg);
  
  return containerElement;
}


function removeXOverlayFromContainer(containerElement) {
  // Find the SVG element we added
  const svg = containerElement.querySelector('svg');
  if (svg) {
    containerElement.removeChild(svg);
  }
}


// This function adds an X overlay to an image element.
function addXOverlay(imgElement, color = 'red', thickness = 3) {
  // Create container
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.display = 'inline-block';
  container.style.width = imgElement.offsetWidth + 'px';
  container.style.height = imgElement.offsetHeight + 'px';
  
  // Add image to container
  imgElement.parentNode.insertBefore(container, imgElement);
  container.appendChild(imgElement);
  
  // Create X overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.pointerEvents = 'none';
  
  // Add diagonal lines
  const line1 = document.createElement('div');
  line1.style.position = 'absolute';
  line1.style.top = '0';
  line1.style.left = '0';
  line1.style.right = '0';
  line1.style.bottom = '0';
  line1.style.background = `linear-gradient(to bottom right, transparent calc(50% - ${thickness/2}px), ${color}, transparent calc(50% + ${thickness/2}px))`;
  
  const line2 = document.createElement('div');
  line2.style.position = 'absolute';
  line2.style.top = '0';
  line2.style.left = '0';
  line2.style.right = '0';
  line2.style.bottom = '0';
  line2.style.background = `linear-gradient(to bottom left, transparent calc(50% - ${thickness/2}px), ${color}, transparent calc(50% + ${thickness/2}px))`;
  
  overlay.appendChild(line1);
  overlay.appendChild(line2);
  container.appendChild(overlay);
  
  return container;
}



export { addXOverlay, addXOverlayToContainer,removeXOverlayFromContainer };