# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: armitite <armitite@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/06/09 13:02:57 by mokariou          #+#    #+#              #
#    Updated: 2025/09/27 19:25:53 by armitite         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

include ft_backend/.env

start:
	docker compose up -d

build:
	docker compose build

reset:
	docker compose down
	docker compose build
	docker compose up -d

down:
	docker compose down

resetdb:
	rm -rf ft_backend/db/database.db
	touch ft_backend/db/database.db
