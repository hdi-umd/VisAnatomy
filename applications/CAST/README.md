# CrossCompatabilityVisScripts

The toCastable.js script will take in the annotated json file and rebuild the svg, adding in information and attributes to make a data enriched svg (dSVG) that are required for the svg to be able to be used in the CAST tool: https://ideas-laboratory.github.io/cast/system/. This would theroetically also work in the CANIS (https://canisjs.github.io/canis-editor/) tool but there does not seem to be a publicly accessible way to interact with the CANIS functions.

toCastable.js script usage: "node toCastable.js [path to file]"
