const { isStatic } = require("../build/isStatic");
const { dirname } = require("path");
const { processAllElements } = require("../tree/processAllElements");
const { childrenIterator } = require("../common/childrenIterator");

async function ssr(req, res, next) {
    if (!req.filePath || isStatic(req.filePath, res.page)) {
        return next();
    }

    const contextProto = {
        filePath: req.filePath,
        dir: dirname(req.filePath),
        isSSR: true,
        body: req.body || {},
        query: req.query || {},
        params: req.devparams || {},
        cookies: req.cookies || {},
        headers: req.headers || {},
    };

    const SSRTags = res.page.querySelectorAll("SSR");

    for (const tag of SSRTags) {
        const newContextScript = tag.firstElementChild;
        if (!newContextScript || newContextScript.tagName !== "script" || !newContextScript.classList.has("ssr")) {
            return next(new Error("SSR tag must have a script with class ssr"));
        }
        const context = Object.create(contextProto);

        Object.assign(context, JSON.parse(newContextScript.innerHTML));
    
        await processAllElements(tag, context);
    
        for (const newChild of childrenIterator(tag)) {
          tag.parentNode.insertBefore(newChild, tag);
        }
    
        tag.remove();
      }
    
      next();
} 

exports.ssr = ssr;