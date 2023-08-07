const express = require('express');
const bcrypt = require('bcrypt');
const { User, Course } = require('./models');
const app = express();
const router = express.Router();
const { sequelize } = require('./models');
const cors = require('cors'); // Import cors
const PORT = 5000;  //

app.use(cors()); // use cors
//

const db = require('./models/index');  // 


db.sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error("Error connecting to the database:", error);
    });














// Middleware to parse JSON
app.use(express.json());

const auth = async (req, res, next) => {
  try {
    let message = null;

    // Parse the user's credentials from the Authorization header.
    const credentials = parseAuthHeader(req);  

    if (credentials) {
      const user = await User.findOne({ where: { emailAddress: credentials.name } });
      if (user) {
        const authenticated = bcrypt.compareSync(credentials.pass, user.password);
        if (authenticated) {
          console.log(`Authentication successful for username: ${user.emailAddress}`);
          req.currentUser = user;
        } else {
          message = `Authentication failure for username: ${user.emailAddress}`;
        }
      } else {
        message = `User not found for username: ${credentials.name}`;
      }
    } else {
      message = 'Auth header not found';
    }

    if (message) {
      console.warn(message);
      res.status(401).json({ message: 'Access Denied' });
    } else {
      next();
    }
  } catch (error) {
    console.error('An error occurred during authentication:', error);
    res.status(500).json({ message: 'An error occurred during authentication' });
  }
};


// User routes
router.get('/api/users', auth, async (req, res) => {
  const currentUser = req.currentUser;
  res.status(200).json(currentUser);
});

router.post('/api/users', async (req, res) => {
  const { firstName, lastName, emailAddress, password } = req.body;
  // Check if any required fields are missing
  if (!firstName || !lastName || !emailAddress || !password) {
    return res.status(400).json({ error: 'firstName, lastName, emailAddress, and password are required.' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);
  //

 try {
    // Check if a user with the given email address already exists
    const existingUser = await User.findOne({ where: { emailAddress } });

    if (existingUser) {
      // If the user already exists, send a 400 status and an error message
      return res.status(400).json({ message: 'A user with the given email address already exists' });
    }

    // If the user doesn't exist, create the new user and send a 201 status
    await User.create({ firstName, lastName, emailAddress, password: hashedPassword });
    res.status(201).location('/').end();
  } catch(error) {
    // If there's an error (like a database error), log the error and send a 500 status
    console.error(error);
    res.status(500).json({ message: 'An error occurred while trying to create the user' });
  }
});

// Courses routes
router.get('/api/courses', async (req, res) => {
  const courses = await Course.findAll({ include: [{ model: User }] });
  res.status(200).json(courses);
});

router.get('/api/courses/:id', async (req, res) => {
  const course = await Course.findByPk(req.params.id, { include: [{ model: User }] });
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
  } else {
    res.json(course);
  }
});
//
router.put('/api/courses/:id', auth, async (req, res) => {
  console.log('Updating course');
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  if (course.userId !== user.id) {
    console.log('Current user is not the owner of the course');
    
    return res.status(403).json({ error: 'You are not the owner of this course' });
  }
  console.log('Received update data:', req.body);
  // Get the updated title and description from the request body
  const { title, description } = req.body;

  // If both title and description are missing, return an error response
  if (!title && !description) {
    return res.status(400).json({ error: 'At least one of title or description must be provided for updating the course.' });
  }

  try {
    // Update the course with the provided data
    if (title) {
      course.title = title;
    }
    if (description) {
      course.description = description;
    }

    // Save the updated course
    await course.save();
    console.log('Course saved successfully');
    // Return a 204 status.
    res.status(204).end();
  } catch (error) {
    console.error('Error saving course:', error);
    if (error instanceof Sequelize.ValidationError) {
      // send a 400 status with the error.
      res.status(400).json({ error: error.errors });
    } else {
      // If it's an unknown error, send a 500 status.
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
});

//

router.post('/api/courses', auth, async (req, res) => {
  const { title, description, userId } = req.body;

  // Validate required fields
  if (!title || !description || !userId) {
    return res.status(400).json({ error: 'title, description, and userId are required.' });
  }

  try {
    const newCourse = {
      title,
      description,
      userId,
      estimatedTime: req.body.estimatedTime, 
      materialsNeeded: req.body.materialsNeeded,
    };

    // Create the new course
    const createdCourse = await Course.create(newCourse);

    // Return a 201 status with a location header to the newly created course.
    res.status(201).location(`/api/courses/${createdCourse.id}`).end();
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      // send a 400 status with the error.
      res.status(400).json({ error: error.errors });
    } else {
      // If it's an unknown error, send a 500 status.
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
});
//
router.delete('/api/courses/:id', auth, async (req, res) => {
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  if (course.userId !== user.id) {
    return res.status(403).json({ error: 'You are not the owner of this course' });
  }

  try {
    // Delete the course
    await course.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/api/courses', async (req, res) => {
  const courses = await Course.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
      },
    ],
  });
  res.json(courses);
});

app.get('/api/courses/:id', async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
      },
    ],
  });
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
  } else {
    res.json(course);
  }
});
//

// ...

app.put('/api/courses/:id', auth, async (req, res) => {
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  if (course.userId !== user.id) {
    return res.status(403).json({ error: 'You are not the owner of this course' });
  }

  // Get the updated title and description from the request body
  const { title, description } = req.body;

  // Check if both title and description are empty or contain only whitespace characters
  if (!title.trim() && !description.trim()) {
    return res.status(400).json({ error: 'At least one of title or description must be provided for updating the course.' });
  }

  try {
    // Update the course with the provided data (if any)
    if (title) {
      course.title = title;
    }
    if (description) {
      course.description = description;
    }

    // Save the updated course
    await course.save();

    // Return a 204 status.
    res.status(204).end();
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      // If it's a Sequelize validation error, send a 400 status with the error.
      res.status(400).json({ error: error.errors });
    } else {
      // If it's an unknown error, send a 500 status.
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
});

// ...


app.delete('/api/courses/:id', auth, async (req, res) => {
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    res.status(404).json({ error: 'Course not found' });
  } else if (course.userId !== user.id) {
    res.status(403).json({ error: 'You are not the owner of this course' });
  } else {
    try {
      await course.destroy();
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
    // delete the course
  }
});





// Use the router
app.use(router);

// Add error handlers, etc.
function parseAuthHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Basic') {
    return null;
  }
  const credentials = Buffer.from(parts[1], 'base64').toString().split(':');
  return { name: credentials[0], pass: credentials[1] };
}

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
//

//
