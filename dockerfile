# Imagen base de Nginx
FROM nginx:alpine

# Copia tu build Angular al directorio de Nginx
COPY ./dist/anotaciones-judiciales-admin/browser /usr/share/nginx/html

# Sobrescribe la configuración de Nginx para manejar rutas de Angular (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto
EXPOSE 80

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]
