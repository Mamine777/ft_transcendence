# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mokariou <mokariou@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/06/09 13:02:57 by mokariou          #+#    #+#              #
#    Updated: 2025/06/09 13:03:41 by mokariou         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #


ENTRY=ft_backend/server.ts

NODE=node
NPM=npm
TSNODE=npx ts-node


all: install run

install:
	$(NPM) install

run:
	$(TSNODE) $(ENTRY)

clean:
	rm -rf dist

reinstall:
	rm -rf node_modules package-lock.json
	$(NPM) install

# Phony targets
.PHONY: all install run clean reinstall
