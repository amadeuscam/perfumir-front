#!/usr/bin/make -f

 
dev-start:
	echo "START FRONTEND"
	docker build -t amadeuscam/vue-datacentric . --no-cache
	docker run -it -p 3000:3000 --rm --name datacentric-app amadeuscam/vue-datacentric:latest
