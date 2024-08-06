window.addEventListener("load", function () {
  // 监控所有类为 section-heading 的元素，当进入视图时添加下划线，离开之后移除下划线
  const annotate = RoughNotation.annotate;
  const groups = [];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio === 1) {
          const annotation = groups.find((group) => group._e === entry.target);
          annotation.show();
        } else {
          const annotation = groups.find((group) => group._e === entry.target);
          annotation.hide();
        }
      });
    },
    { threshold: 0.5 }
  );

  // 首次渲染
  function renderAnnotate() {
    const headings = document.querySelectorAll(".section-heading");

    headings.forEach((heading) => {
      if (groups.find((group) => group._e === heading)) return;

      observer.observe(heading);
      const type = heading.getAttribute("data-type") ?? "underline";
      const color = heading.getAttribute("data-color") ?? "#007a7a";
      const annotation = annotate(heading, {
        type,
        color,
        strokeWidth: 1.5,
      });
      groups.push(annotation);
      // check if current heading is in the view
      if (heading.getBoundingClientRect().top < window.innerHeight) {
        annotation.show();
      }
    });
  }

  renderAnnotate();
  // 观察全局 dom 变化，再次渲染
  const observer3 = new MutationObserver((mutations) => {
    renderAnnotate();
  });

  observer3.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });

  const observer2 = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          entry.target.classList.add("project-flip-up");
        } else {
          entry.target.classList.remove("project-flip-up");
        }
      });
    },
    { threshold: 0.5 }
  );

  const projects = document.querySelectorAll(".__project__");
  projects.forEach((project) => {
    observer2.observe(project);
  });
});
