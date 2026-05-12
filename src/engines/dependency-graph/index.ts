export const extractDependencies = (markdownContent: string): string[] => {
  const deps: string[] = [];
  
  // Extract explicit dependsOn blocks from metadata frontmatter or comments
  // Example: dependsOn: [recommend-gpu-market, deploy-ai-project]
  const dependsOnMatch = markdownContent.match(/dependsOn:\s*\[(.*?)\]/i);
  if (dependsOnMatch && dependsOnMatch[1]) {
    const parsedDeps = dependsOnMatch[1].split(',').map(d => d.trim().replace(/['"]/g, ''));
    deps.push(...parsedDeps);
  }

  // Also check for explicit "Requires: <skill>" lines
  const requiresMatch = markdownContent.match(/Requires:\s*([a-zA-Z0-9-]+)/ig);
  if (requiresMatch) {
    requiresMatch.forEach(match => {
      const dep = match.split(':')[1].trim();
      if (!deps.includes(dep)) {
        deps.push(dep);
      }
    });
  }

  return [...new Set(deps)];
};
