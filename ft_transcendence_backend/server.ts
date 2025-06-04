/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mokariou <mokariou@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/04 12:50:57 by mokariou          #+#    #+#             */
/*   Updated: 2025/06/04 13:00:11 by mokariou         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import fastify from "fastify";
import path from 'path'
import fastifyFormbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import { request } from 'http';
import { register } from 'module';

// here I create the server
const server = fastify();

// here I register the path where the frontend is
server.register(fastifyStatic, {
	root: path.join(__dirname, "public"),
	prefix: "/",
});


//here I create a port where we can access the server
server.listen({port:3000}, (err) =>{
	if (err){
		console.error(err);
    	process.exit(1);
	}
	console.log("server is running 🚀")
});


// to compile use command "npm install " && then "npx ts-node server.ts"