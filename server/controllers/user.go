package controllers

import (
	"database/sql"
	"main/forms"
	"main/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct{}

var userModel = new(models.UserModel)
var userForm = new(forms.UserForm)

func (u *UserController) RegisterUser(c *gin.Context, db *sql.DB) (user models.User, err error) {
	// get the request body and bind it to the RegisterForm struct
	var registerForm forms.RegisterForm

	if err := c.ShouldBindJSON(&registerForm); err != nil {
		message := userForm.Register(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": message,
		})
		return user, err
	}

	if err := userModel.Register(registerForm, db); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return user, err
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User created successfully",
	})

	return user, nil
}

func (u *UserController) GetUser(c *gin.Context, db *sql.DB) (user models.User, err error) {
	username := c.Param("username")

	user, err = userModel.Get(username, db)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return user, err
	}

	c.JSON(http.StatusOK, user)

	return user, nil
}

// Delete a user
func (u *UserController) DeleteUser(c *gin.Context, db *sql.DB) (err error) {

	id := c.Param("username")

	if err := userModel.Delete(id, db); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return err
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})

	return nil
}
