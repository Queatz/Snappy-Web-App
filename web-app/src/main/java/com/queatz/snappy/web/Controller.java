package com.queatz.snappy.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Controller extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html");
        resp.setCharacterEncoding("UTF8");

        resp.getWriter().write("<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>Village</title>\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n" +
                "    <meta name=\"google-signin-scope\" content=\"profile email\">\n" +
                "    <meta name=\"google-signin-client_id\" content=\"1098230558363-rsipe4dnf6o9ke80faahujunvar5mjdf.apps.googleusercontent.com\">\n" +
                "    <base href=\"/\" />\n" +
                "\n" +
                "    <link rel=\"stylesheet\" href=\"node_modules/normalize.css/normalize.css\" />\n" +
                "    <link rel=\"stylesheet\" href=\"app/style.css\" />\n" +
                "    <link rel=\"stylesheet\" href=\"node_modules/materialize-css/dist/css/materialize.min.css\" />\n" +
                "    <link rel=\"shortcut icon\" href=\"/img/favicon.png\" />\n" +
                "\n" +
                "    <script src=\"node_modules/es6-shim/es6-shim.min.js\"></script>\n" +
                "    <script src=\"node_modules/systemjs/dist/system-polyfills.js\"></script>\n" +
                "    <script src=\"node_modules/angular2/bundles/angular2-polyfills.js\"></script>\n" +
                "    <script src=\"node_modules/systemjs/dist/system.src.js\"></script>\n" +
                "    <script src=\"node_modules/rxjs/bundles/Rx.js\"></script>\n" +
                "    <script src=\"node_modules/angular2/bundles/angular2.dev.js\"></script>\n" +
                "    <script src=\"node_modules/angular2/bundles/http.js\"></script>\n" +
                "    <script src=\"node_modules/angular2/bundles/router.dev.js\"></script>\n" +
                "    <script src=\"node_modules/moment/moment.js\"></script>\n" +
                "    <script src=\"config.js\"></script>\n" +
                "    <script>\n" +
                "        System.import('app/boot').then(null, console.error.bind(console));\n" +
                "    </script>\n" +
                "\n" +
                "    <script src=\"http://code.jquery.com/jquery-2.1.4.min.js\"></script>\n" +
                "    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.js\"></script>\n" +
                "\n" +
                "    <script src=\"node_modules/materialize-css/dist/js/materialize.min.js\" async defer></script>\n" +
                "    <script src=\"node_modules/masonry-layout/dist/masonry.pkgd.min.js\" async defer></script>\n" +
                "    <script src=\"https://apis.google.com/js/platform.js\" async defer></script>\n" +
                "</head>\n" +
                "    <body>\n" +
                "        <app></app>\n" +
                "    </body>\n" +
                "</html>");

        resp.getWriter().close();
    }
}