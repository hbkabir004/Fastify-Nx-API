/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

interface Member {
  id: string;
  name: string;
  email: string;
}

let members: Member[] = [
  { id: '1', name: 'Roman', email: 'roman@exateks.com' },
  { id: '2', name: 'Abir', email: 'abir@exateks.com' },
  { id: '3', name: 'Saki', email: 'saki@exateks.com' },
  { id: '4', name: 'Rahmat', email: 'rahmat@exateks.com' },
];

export default async function (fastify: any) {
  fastify.get('/', async function () {
    return { message: 'Hello API' };
  });

  // Get all members
  fastify.get('/members', (request: any, reply: any) => {
    return members;
  });

  // Get a specific member by ID
  fastify.get('/members/:id', (request: any, reply: any) => {
    const id: number = parseInt(request.params.id);
    const member: Member | undefined = members.find(
      (member) => parseInt(member.id) === id
    );
    if (!member) {
      return reply.code(404).send({ message: 'member not found' });
    }
    return member;
  });

  // Create a new member
  // Test Command: curl -X POST -H "Content-Type: application/json" -d '{"name": "Exateks"}' http://localhost:5000/members
  fastify.post('/members', (request: any, reply: any) => {
    const newmember: Member = request.body;
    const newmemberID: number =
      members.map((member) => parseInt(member.id)).length + 1;
    const newProperties: Member = {
      id: `${newmemberID}`,
      ...newmember,
    };

    const newAddedMember: Member = { ...newProperties };
    members.push(newAddedMember);
    return newAddedMember;
  });

  // Update an existing member's data
  // Test Command: curl -X PUT -H "Content-Type: application/json" -d '{"email": "newitem@exateks.com"}' http://localhost:5000/members/2
  fastify.put('/members/:id', (request: any, reply: any) => {
    const id: number = parseInt(request.params.id);
    const updatedmember: Member = request.body;
    let found = false;
    members = members.map((member) => {
      if (parseInt(member.id) === id) {
        found = true;
        return { ...member, ...updatedmember };
      }
      return member;
    });
    if (!found) {
      return reply.code(404).send({ message: 'Member not Found! :/' });
    }
    return { message: 'Member Updated Successfully :)' };
  });

  // Delete an member
  // Test Command: curl -X DELETE http://localhost:5000/members/0
  fastify.delete('/members/:id', (request: any, reply: any) => {
    const id: number = parseInt(request.params.id);
    const initialLength: number = members.length;
    members = members.filter((member) => parseInt(member.id) !== id);
    if (members.length === initialLength) {
      return reply.code(404).send({ message: 'member not found' });
    }
    return { message: 'Member Deleted Successfully ;)' };
  });
}
