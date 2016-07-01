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
                "    <head>\n" +
                "        <meta charset=\"UTF-8\">\n" +
                "        <title>Village</title>\n" +
                "        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n" +
                "        <meta name=\"google-signin-scope\" content=\"profile email\">\n" +
                "        <meta name=\"google-signin-client_id\" content=\"1098230558363-rsipe4dnf6o9ke80faahujunvar5mjdf.apps.googleusercontent.com\">\n" +
                "        <base href=\"/\" />\n" +
                "\n" +
                "        <link rel=\"stylesheet\" href=\"node_modules/normalize.css/normalize.css\" />\n" +
                "        <link rel=\"stylesheet\" href=\"app/style.css\" />\n" +
                "        <link rel=\"stylesheet\" href=\"node_modules/materialize-css/dist/css/materialize.min.css\" />\n" +
                "        <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\" />\n" +
                "        <link rel=\"shortcut icon\" sizes=\"64x64\" href=\"/img/favicon.png\" />\n" +
                "        <link rel=\"apple-touch-icon\" sizes=\"1448x1448\" href=\"/img/pickaxe.png\" />\n" +
                "        <meta name=\"mobile-web-app-capable\" content=\"yes\" />\n" +
                "        <link rel=\"icon\" href=\"/img/favicon.png\" />\n" +
                "\n" +
                "        <script src=\"node_modules/core-js/client/shim.min.js\"></script>\n" +
                "        <script src=\"node_modules/zone.js/dist/zone.js\"></script>\n" +
                "        <script src=\"node_modules/reflect-metadata/Reflect.js\"></script>\n" +
                "        <script src=\"node_modules/systemjs/dist/system.src.js\"></script>\n" +
                "        <script src=\"node_modules/rxjs/bundles/Rx.min.js\"></script>\n" +
                "        <script src=\"config.js\"></script>\n" +
                "        <script>System.import('app/boot').then(null, console.error.bind(console));</script>\n" +
                "\n" +
                "        <script src=\"node_modules/moment/moment.js\"></script>\n" +
                "        <script src=\"https://code.jquery.com/jquery-2.1.4.min.js\"></script>\n" +
                "        <script src=\"https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.js\"></script>\n" +
                "\n" +
                "        <script src=\"node_modules/materialize-css/dist/js/materialize.min.js\" async defer></script>\n" +
                "        <script src=\"node_modules/masonry-layout/dist/masonry.pkgd.min.js\" async defer></script>\n" +
                "        <script src=\"https://apis.google.com/js/platform.js\" async defer></script>\n" +
                "        <script src=\"https://maps.googleapis.com/maps/api/js?key=AIzaSyBuqXrG4rHZ52S8Z71vdLuc2hTb2Oigbj4\" async defer></script>\n" +
                "    </head>\n" +
                "    <body>\n" +
                "        <app></app>\n" +
                "    </body>\n" +
                "</html>\n");

        resp.getWriter().close();
    }
}